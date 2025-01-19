from django.db import models

class Cause(models.Model):
    caused_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    img = models.ImageField(upload_to='project_images/')
    causes = models.ForeignKey(Cause, on_delete=models.CASCADE, related_name='cause')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
