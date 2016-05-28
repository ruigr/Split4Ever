# split4ever

In this version we use Vagrant to provision the environment inside 
VirtualBox virtual machine with support for Docker containers.

Steps: 

 1. Install VirtualBox and Vagrant
 - > cd $PROJECT_HOME
 - > vagrant init ubuntu/trusty64   <== No need, because is already done 
 - > vi Vagrantfile
 - > vagrant up
 - > vagrant ssh
 
 Note: You can do "> vagrant destroy && vagrant up" to rebuild from the start 
 or use "> vagrant provision". For more information use "> vagrant help"
 

