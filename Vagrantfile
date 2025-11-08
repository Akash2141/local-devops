VAGRANTFILE_API_VERSION = "2"
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define "vagrant1" do |vagrant1|
    vagrant1.vm.box = "ubuntu/jammy64"
    vagrant1.vm.provider "virtualbox" do |vb|
        vb.customize [ "modifyvm", :id, "--uartmode1", "disconnected" ]
    end
    vagrant1.vm.network "forwarded_port", guest: 80, host: 8080
    vagrant1.vm.network "forwarded_port", guest: 8080, host: 8081
    vagrant1.vm.network "forwarded_port", guest: 10443, host: 10443
    vagrant1.vm.network "forwarded_port", guest: 8443, host: 8444
    vagrant1.vm.network "forwarded_port", guest: 8082, host: 8082 # argocd port
    # vagrant1.vm.network "forwarded_port", guest: 32000, host: 32000
    vagrant1.vm.network "forwarded_port", guest: 443, host: 8443
    vagrant1.vm.network "forwarded_port", guest: 30267, host: 8085
    vagrant1.vm.network "forwarded_port", guest: 8200, host: 8200
    vagrant1.vm.provider "virtualbox" do |vb|
      vb.memory = "4096"
      vb.cpus = "3"
    end
    vagrant1.vm.synced_folder "./practice-docker", "/home/vagrant/practice-docker"
    vagrant1.vm.synced_folder "./sample-project", "/home/vagrant/sample-project"
    vagrant1.vm.synced_folder "./practice-k8s", "/home/vagrant/practice-k8s"
    vagrant1.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update
      sudo apt install ca-certificates curl gnupg lsb-release -y
      sudo mkdir -p /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      sudo apt update
      sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
      sudo snap install microk8s --classic
      sudo microk8s enable registry 
      sudo microk8s enable dashboard 
    SHELL
  end
end