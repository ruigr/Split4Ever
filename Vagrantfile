# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "ubuntu/trusty64"

  #Set hostname
    config.vm.hostname = "herbie.split4ever.com"
    
  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
   config.vm.network "private_network", ip: "172.31.32.253"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
   config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
     vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
   end
  #
  # View the documentation for the provider you are using for more
  # information on available options.

  # Define a Vagrant Push strategy for pushing to Atlas. Other push strategies
  # such as FTP and Heroku are also available. See the documentation at
  # https://docs.vagrantup.com/v2/push/atlas.html for more information.
  # config.push.define "atlas" do |push|
  #   push.app = "YOUR_ATLAS_USERNAME/YOUR_APPLICATION_NAME"
  # end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
   config.vm.provision "shell", inline: <<-SHELL
   
   echo "*************************************"
   echo "*********   DOCKER INSTALL   ********"
   echo "*************************************"
     
   sudo apt-get update
   sudo apt-get upgrade -y
   # sudo apt-get install bind9 dnsutils
   /bin/sh -c ' if [ -z `which curl` ]; then 
                   echo "\n ===>Install Curl <=== \n";
                   sudo apt-get install curl; 
                fi'
   curl -fsSL https://get.docker.com/ | sh
     
  #Note: If your company is behind a filtering proxy,
  # you may find that the apt-key command fails
  # for the Docker repo during installation. 
  # To work around this, add the key by removing the comment
  # from the next instruction:
  
  #curl -fsSL https://get.docker.com/gpg | sudo apt-key add -
  
  # Add "docker" group to user to allow Docker execution as non-root 
  
  DOCKER_USER="vagrant"
  echo "Setting docker admin (non-root user): $DOCKER_USER ... "
  sudo usermod -aG docker $DOCKER_USER 
  echo "$DOCKER_USER is now in 'docker' group!"
  
  # echo "*************************************"
  # echo "******   Split4Ever INSTALL   *******"
  # echo "*************************************"
  
  # sudo apt-get install nodejs npm -y
  # sudo npm install -g grunt-cli
  # git clone https://github.com/split4ever/main.git
  # cd main
  # npm install
  # grunt &
  
  #echo "*************************************"
  #echo "********   Apache2 INSTALL   ********"
  #echo "*************************************"
  
  #   sudo apt-get install -y apache2

  echo "*************************************"
  echo "**************   FIM   **************"
  echo "*************************************"
   
   SHELL
end
