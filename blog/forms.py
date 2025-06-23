from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Post

# Keep your existing PostForm
class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'content']

# Add a new form for registration
class SignUpForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        # You can add more fields here if you customize your user model
        fields = ('username', 'first_name', 'last_name', 'email')

