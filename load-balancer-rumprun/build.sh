#/bin/bash

cd $HOME/repos

git clone https://github.com/ltearno/rumprun.git
cd rumprun

export PLATFORM=hw
export MACHINE=x86_64
export TESTS=qemu
export EXTRAFLAGS=
export CC=gcc

git submodule update --init

cd ..
git clone https://github.com/ltearno/rumprun-packages.git
cd rumprun-packages

cd nginx
make
rumprun-bake hw_virtio ./nginx.bin bin/nginx

# pour lancer sans réseau
rumprun qemu -M 128 -i \
    -b images/data.iso,/data \
    -- nginx.bin -c /data/conf/nginx.conf

# creation d'un device tap
sudo ip tuntap add tap1 mode tap
#sudo ip addr add 10.0.0.100/24 dev tap1
sudo ip link set dev tap1 up

# ajout du tap1 au bridge
sudo brctl addif bridge43 tap1

# vérification
ip link ls
ip addr

# si le traffic ne passe pas, essayer cela  (voir 'No traffic gets through' dans la page https://wiki.linuxfoundation.org/networking/bridge#No_traffic_gets_trough_.28except_ARP_and_STP.29):
# voir aussi https://wiki.libvirt.org/page/Net.bridge.bridge-nf-call_and_sysctl.conf
# par défaut les bridges sont soumis au network filtering, iptables etc
# cd /proc/sys/net/bridge
# for f in bridge-nf-*; do echo 0 > $f; done