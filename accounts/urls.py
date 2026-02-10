from __future__ import annotations

from django.urls import path

from accounts.views import CurrentUserView, UserListView

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("list", UserListView.as_view(), name="user-list"),
]
