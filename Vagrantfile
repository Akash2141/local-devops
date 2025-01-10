VAGRANTFILE_API_VERSION = "2"
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define "vagrant1" do |vagrant1|
    vagrant1.vm.box = "ubuntu/jammy64"
    vagrant1.vm.network "forwarded_port", guest: 80, host: 8080
    vagrant1.vm.network "forwarded_port", guest: 8080, host: 8081
    vagrant1.vm.network "forwarded_port", guest: 5050, host: 8082
    vagrant1.vm.network "forwarded_port", guest: 5432, host: 8083
    vagrant1.vm.network "forwarded_port", guest: 443, host: 8443
    vagrant1.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.cpus = "2"
    end
    vagrant1.vm.synced_folder "./practice-docker", "/home/vagrant/practice-docker"
    vagrant1.vm.synced_folder "./sample-project", "/home/vagrant/sample-project"
    vagrant1.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update
      sudo apt install podman -y
      sudo snap install microk8s --classic
    SHELL
  end
end