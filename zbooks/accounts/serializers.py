from rest_framework import serializers
from .models import ChartOfAccounts, JournalEntry, JournalEntryLine, User, Organization, UserOrganization

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    full_name = serializers.CharField(max_length=150)
    company_name = serializers.CharField(max_length=200)
    phone_cc = serializers.CharField(max_length=5)
    phone = serializers.CharField(max_length=15)
    country = serializers.CharField(max_length=100, default="India")
    state = serializers.CharField(max_length=100, default="Tamil Nadu")
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value
    
    def validate_phone(self, value):
        # Remove any spaces, dashes, or parentheses
        cleaned_phone = ''.join(filter(str.isdigit, value))
        if len(cleaned_phone) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return cleaned_phone
    
    def create(self, validated_data):
        from datetime import date
        from django.db import transaction
        
        # Extract organization and user data
        company_name = validated_data['company_name']
        phone_cc = validated_data['phone_cc']
        phone = validated_data['phone']
        country = validated_data['country']
        state = validated_data['state']
        password = validated_data['password']
        
        with transaction.atomic():
            # Create organization with proper fiscal year
            current_year = date.today().year
            fiscal_year_start = f"{current_year}-04-01"
            
            org_data = {
                'name': company_name,
                'address': f"{state}, {country}",
                'phone': f"{phone_cc} {phone}",
                'email': validated_data['email'],
                'website': '',
                'fiscal_year_start': fiscal_year_start,
                'currency': 'INR' if country == 'India' else 'USD',
            }
            
            # Create organization first
            organization = Organization.objects.create(**org_data)
            
            # Create user
            user = User.objects.create_user(
                email=validated_data['email'],
                password=password,
                full_name=validated_data['full_name'],
                phone=f"{phone_cc}{phone}"
            )
            
            # Create user-organization relationship
            UserOrganization.objects.create(
                user=user,
                organization=organization,
                role='owner',
                is_default=True
            )
            
            return user
    
    def to_representation(self, instance):
        """Return only User model fields in response"""
        return {
            'id': instance.id,
            'email': instance.email,
            'full_name': instance.full_name,
            'phone': instance.phone,
            'is_active': instance.is_active,
            'created_at': instance.created_at.isoformat() if instance.created_at else None
        }

class UserSerializer(serializers.ModelSerializer):
    current_organization = serializers.SerializerMethodField()
    current_role = serializers.SerializerMethodField()
    organizations = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ("id", "email", "full_name", "phone", "is_active", "created_at", 
                 "current_organization", "current_role", "organizations")
    
    def get_current_organization(self, obj):
        org = obj.current_organization
        return OrganizationSerializer(org).data if org else None
    
    def get_current_role(self, obj):
        return obj.current_role
    
    def get_organizations(self, obj):
        memberships = obj.memberships.select_related('organization').all()
        return [
            {
                "id": m.organization.id,
                "name": m.organization.name,
                "role": m.role,
                "is_default": m.is_default
            }
            for m in memberships
        ]


class ChartOfAccountsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChartOfAccounts
        fields = (
            "id",
            "organization",
            "account_code",
            "account_name",
            "account_type",
            "parent_account",
            "description",
            "is_active",
            "opening_balance",
            "current_balance",
            "created_at",
        )
        read_only_fields = ("id", "created_at")


class JournalEntryLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntryLine
        fields = (
            "id",
            "account",
            "description",
            "debit_amount",
            "credit_amount",
            "created_at",
        )
        read_only_fields = ("id", "created_at")


class JournalEntrySerializer(serializers.ModelSerializer):
    lines = JournalEntryLineSerializer(many=True)

    class Meta:
        model = JournalEntry
        fields = (
            "id",
            "organization",
            "entry_number",
            "entry_date",
            "entry_type",
            "reference",
            "description",
            "total_debit",
            "total_credit",
            "is_posted",
            "posted_by",
            "posted_at",
            "created_by",
            "created_at",
            "lines",
        )
        read_only_fields = ("id", "created_at", "posted_at")

    def create(self, validated_data):
        lines_data = validated_data.pop("lines", [])
        journal_entry = JournalEntry.objects.create(**validated_data)
        for line in lines_data:
            JournalEntryLine.objects.create(entry=journal_entry, **line)
        return journal_entry

    def update(self, instance, validated_data):
        lines_data = validated_data.pop("lines", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if lines_data is not None:
            instance.lines.all().delete()
            for line in lines_data:
                JournalEntryLine.objects.create(entry=instance, **line)
        return instance


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
            "address",
            "phone",
            "email",
            "website",
            "gst_number",
            "pan_number",
            "currency",
            "fiscal_year_start",
            "timezone",
            "created_at",
        )
        read_only_fields = ("id", "created_at")


class MembershipSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(), source="organization", write_only=True
    )

    class Meta:
        model = UserOrganization
        fields = ("id", "organization", "organization_id", "role", "is_default", "created_at")
        read_only_fields = ("id", "created_at")
