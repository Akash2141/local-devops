VAGRANTFILE_API_VERSION = "2"
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define "vagrant1" do |vagrant1|
    vagrant1.vm.box = "ubuntu/jammy64"
    vagrant1.vm.network "forwarded_port", guest: 80, host: 8080
    vagrant1.vm.network "forwarded_port", guest: 8080, host: 8081
    vagrant1.vm.network "forwarded_port", guest: 10443, host: 10443
    vagrant1.vm.network "forwarded_port", guest: 8443, host: 8444
    vagrant1.vm.network "forwarded_port", guest: 8082, host: 8082 # argocd port
    # vagrant1.vm.network "forwarded_port", guest: 32000, host: 32000
    vagrant1.vm.network "forwarded_port", guest: 443, host: 8443
    vagrant1.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.cpus = "2"
    end
    vagrant1.vm.synced_folder "./practice-docker", "/home/vagrant/practice-docker"
    vagrant1.vm.synced_folder "./sample-project", "/home/vagrant/sample-project"
    vagrant1.vm.synced_folder "./practice-k8s", "/home/vagrant/practice-k8s"
    vagrant1.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update
      sudo apt install -y python3-pip curl
      pip3 install podman-compose
      sudo apt install podman -y
      sudo snap install microk8s --classic
      sudo microk8s enable registry 
      sudo microk8s enable dashboard 
      sudo microk8s enable dns 
      sudo microk8s enable storage 
      sudo microk8s enable rbac 
      sudo microk8s enable ingress 
      sudo microk8s enable metallb
    SHELL
  end
end