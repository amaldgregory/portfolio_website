from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils import timezone
from datetime import timedelta
from .models import CommunityMessage
from .forms import CommunityMessageForm

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR') #gets me to the original sender even if passed through CDN 
    #returns null or value
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR') # or we try this method to get ip
    return ip 


def community_wall(request):
    # Rate limiting
    client_ip = get_client_ip(request)
    recent_post = CommunityMessage.objects.filter(
        ip_address=client_ip,
        created_at__gte=timezone.now() - timedelta(minutes=0.1)
    ).exists()
    
    if request.method == 'POST' and not recent_post:
        form = CommunityMessageForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.ip_address = client_ip
            message.save()
            messages.success(request, 'Your message has been posted!')
            return redirect('community_wall')
        else:
            messages.error(request, 'Please correct the errors below.')

    elif request.method == 'POST' and recent_post:
        messages.warning(request, 'Please wait a minute before posting again.')
        form = CommunityMessageForm()
    else:
        form = CommunityMessageForm()
    
    wall_messages = CommunityMessage.objects.all()[:50]  # Limit to 50 messages
    
    return render(request, 'wall.html', {
        'form': form,
        'messages': wall_messages
    })
