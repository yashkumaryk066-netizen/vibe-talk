# 🌍 VibeTalk - International Compliance Implementation
# Developer: Yash Ankush Mishra (Rangra Developer)
# All GDPR, COPPA, App Store Ready Features

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# ========================================
# 📋 USER CONSENT MODEL (GDPR Required)
# ========================================

class UserConsent(models.Model):
    """
    Tracks user consent for GDPR compliance
    """
    CONSENT_TYPES = [
        ('terms', 'Terms of Service'),
        ('privacy', 'Privacy Policy'),
        ('cookies', 'Cookie Policy'),
        ('marketing', 'Marketing Emails'),
        ('data_processing', 'Data Processing'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consents')
    consent_type = models.CharField(max_length=50, choices=CONSENT_TYPES)
    version = models.CharField(max_length=10, help_text="Policy version (e.g. 2.0)")
    consented_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    withdrawn_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'user_consents'
        ordering = ['-consented_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.consent_type} v{self.version}"


# ========================================
# 📤 DATA EXPORT REQUEST (GDPR Article 15)
# ========================================

class DataExportRequest(models.Model):
    """
    User requests to export their data (GDPR right to data portability)
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='export_requests')
    requested_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    file_url = models.URLField(blank=True, null=True, help_text="S3/Cloudinary URL")
    completed_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True, help_text="Download link expires")
    
    class Meta:
        db_table = 'data_export_requests'
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"Export request by {self.user.username} - {self.status}"


# ========================================
# ❌ ACCOUNT DELETION REQUEST (GDPR Article 17)
# ========================================

class AccountDeletionRequest(models.Model):
    """
    User requests to delete their account (GDPR right to erasure)
    30-day grace period before permanent deletion
    """
    STATUS_CHOICES = [
        ('pending', 'Pending (30 days)'),
        ('cancelled', 'Cancelled by User'),
        ('completed', 'Permanently Deleted'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='deletion_requests')
    requested_at = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(help_text="Scheduled deletion (30 days)")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(blank=True, help_text="Optional reason for deletion")
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'deletion_requests'
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"Deletion request by {self.user.username} - {self.status}"


# ========================================
# 🚨 CONTENT MODERATION LOG
# ========================================

class ContentModerationLog(models.Model):
    """
    Tracks moderated content for compliance and appeals
    """
    CONTENT_TYPES = [
        ('profile', 'Profile'),
        ('message', 'Message'),
        ('image', 'Image'),
        ('voice', 'Voice Note'),
    ]
    
    VIOLATION_TYPES = [
        ('nudity', 'Nudity/Sexual Content'),
        ('hate_speech', 'Hate Speech'),
        ('violence', 'Violence'),
        ('spam', 'Spam'),
        ('minor', 'Underage User'),
        ('harassment', 'Harassment'),
        ('scam', 'Scam/Fraud'),
        ('other', 'Other'),
    ]
    
    ACTION_TYPES = [
        ('warn', 'Warning'),
        ('content_removed', 'Content Removed'),
        ('temp_ban', 'Temporary Ban'),
        ('permanent_ban', 'Permanent Ban'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='moderation_logs')
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    content_id = models.IntegerField(help_text="ID of moderated content")
    violation_type = models.CharField(max_length=30, choices=VIOLATION_TYPES)
    action_taken = models.CharField(max_length=30, choices=ACTION_TYPES)
    moderator_notes = models.TextField(blank=True)
    automated = models.BooleanField(default=False, help_text="AI flagged vs human review")
    created_at = models.DateTimeField(auto_now_add=True)
    appeal_requested = models.BooleanField(default=False)
    appeal_resolved = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'moderation_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.violation_type} - {self.action_taken}"


# ========================================
# 📞 GRIEVANCE TICKET (India IT Rules 2021)
# ========================================

class GrievanceTicket(models.Model):
    """
    Grievance redressal mechanism for Indian users
    """
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    CATEGORY_CHOICES = [
        ('privacy', 'Privacy Concern'),
        ('content', 'Content Violation'),
        ('harassment', 'Harassment'),
        ('account_issue', 'Account Issue'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='grievances', null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_time = models.DurationField(null=True, blank=True, help_text="Time to resolve")
    officer_response = models.TextField(blank=True)
    
    class Meta:
        db_table = 'grievance_tickets'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if self.status == 'resolved' and not self.resolved_at:
            self.resolved_at = timezone.now()
            self.resolution_time = self.resolved_at - self.created_at
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Grievance #{self.id} - {self.category} - {self.status}"


# ========================================
# 🔒 AGE VERIFICATION RECORD
# ========================================

class AgeVerification(models.Model):
    """
    Tracks age verification attempts for compliance
    """
    VERIFICATION_METHODS = [
        ('id_card', 'Government ID'),
        ('selfie', 'Selfie Verification'),
        ('credit_card', 'Credit Card'),
        ('phone', 'Phone Number'),
        ('manual', 'Manual Review'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='age_verifications')
    method = models.CharField(max_length=30, choices=VERIFICATION_METHODS)
    document_url = models.URLField(blank=True, null=True, help_text="Encrypted document URL")
    verified_age = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.CharField(max_length=100, blank=True, help_text="Service/Staff")
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'age_verifications'
        ordering = ['-id']
    
    def __str__(self):
        return f"{self.user.username} - {self.method} - {self.status}"


# ========================================
# 🔔 AUDIT LOG (Compliance Trail)
# ========================================

class AuditLog(models.Model):
    """
    Complete audit trail for compliance and security
    """
    ACTION_TYPES = [
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('profile_update', 'Profile Updated'),
        ('password_change', 'Password Changed'),
        ('consent_given', 'Consent Given'),
        ('consent_withdrawn', 'Consent Withdrawn'),
        ('data_exported', 'Data Exported'),
        ('account_deleted', 'Account Deleted'),
        ('report_submitted', 'Report Submitted'),
        ('admin_action', 'Admin Action'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,related_name='audit_logs')
    action = models.CharField(max_length=50, choices=ACTION_TYPES)
    ip_address = models.GenericIPAddressField()
    user_agent = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(blank=True, null=True, help_text="Additional context")
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['action', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.action} at {self.timestamp}"
