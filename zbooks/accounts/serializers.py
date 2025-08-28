from rest_framework import serializers
from .models import ChartOfAccounts, JournalEntry, JournalEntryLine, User, Organization, UserOrganization

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(write_only=True)
    phone_cc = serializers.CharField(write_only=True)
    phone = serializers.CharField(write_only=True)
    country = serializers.CharField(write_only=True)
    state = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ("id", "email", "password", "company_name", "phone_cc", "phone", "country", "state")
    
    def create(self, validated_data):
        # Extract organization data
        company_name = validated_data.pop('company_name')
        phone_cc = validated_data.pop('phone_cc')
        phone = validated_data.pop('phone')
        country = validated_data.pop('country')
        state = validated_data.pop('state')
        
        # Create organization with address from country and state
        org_data = {
            'name': company_name,
            'address': f"{state}, {country}",
            'phone': f"{phone_cc} {phone}",
            'email': validated_data['email'],  # Use user email as org email
            'website': '',
            'fiscal_year_start': '2024-04-01',  # Default fiscal year start
        }
        
        # Create organization first
        organization = Organization.objects.create(**org_data)
        
        # Create user with organization
        password = validated_data.pop('password')
        user = User(
            email=validated_data['email'],
            full_name=company_name,  # Use company name as full name
            organization=organization
        )
        user.set_password(password)
        user.save()
        
        # Create user-organization relationship
        UserOrganization.objects.create(
            user=user,
            organization=organization,
            role='owner',
            is_default=True
        )
        
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id","email","full_name","phone","role","is_active","created_at")


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
