from django import forms
from .models import CommunityMessage

class CommunityMessageForm(forms.ModelForm):
    class Meta:
        model = CommunityMessage
        fields = ['name', 'text']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your name',
                'maxlength': 50
            }),
            'text': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Your message...',
                'rows': 3,
                'maxlength': 200
            })
        }
