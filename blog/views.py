from django.shortcuts import render, get_object_or_404, redirect
from .models import Post
from .forms import PostForm
from django.contrib.auth import login
from .forms import SignUpForm # Import the new form
from django.contrib.auth.decorators import login_required , permission_required

# Read (List) View
def post_list(request):
    posts = Post.objects.select_related('author').all()
    return render(request, 'post_list.html', {'posts': posts})

# Read (Detail) View
def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    return render(request, 'post_detail.html', {'post': post})

# Create View
@login_required 
@permission_required('blog.add_post', raise_exception=True)
def post_create(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            # Don't save to the database just yet
            post = form.save(commit=False)
            # Assign the current logged-in user as the author
            post.author = request.user 
            # Now save the post with the author included
            post.save()
            return redirect('post_list')
    else:
        form = PostForm()
    return render(request, 'post_form.html', {'form': form})   

# Update View
def post_update(request, slug):
    post = get_object_or_404(Post, slug=slug)
    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            return redirect('post_detail', slug=post.slug)
    else:
        form = PostForm(instance=post)
    return render(request, 'post_form.html', {'form': form, 'post': post})

# Delete View
def post_delete(request, slug):
    post = get_object_or_404(Post, slug=slug)
    if request.method == 'POST':
        post.delete()
        return redirect('post_list')
    return render(request, 'post_confirm_delete.html', {'post': post})

def register(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()  # This saves the new user
            login(request, user)  # Log the user in automatically
            return redirect('post_list')  # Redirect to the home page
    else:
        form = SignUpForm()
    return render(request, 'registration/register.html', {'form': form})