# Nginx load balancer and reverse proxy

RumpRun is used to build and run Nginx. It will listen on the provided virtio nic on 8080 TCP port and forward incoming HTTP requests to the [frontend](../frontend-runtimejs).

## How to build in docker

Build the docker image or execute each steps on your system (granted your environment will fit RumpRun requirements...) :

        docker build . -t rumprun

## Build the nginx application

You should have `rumprun-bake` and `rumprun` in your path.

Go to the `rumprun-packages/nginx` directory.

    make clean
    make

    # when compilation fails, remove `-Werror` in `nginx/build/obs/Makefile`
    make

    rumprun-bake hw_virtio ./nginx.bin bin/nginx

To reconfigure Nginx, edit the nginx.conf file and

    rm images/data.iso
    make

## Run the application

Simplest way :

    # NAT-ed rumprun, listens on the 8000 port
    rumprun qemu -i -M 128 \
        -I if,vioif,'-net user,net=192.168.76.0/24,dhcpstart=192.168.76.9,hostfwd=tcp::8000-:80' \
        -W if,inet,dhcp \
        -b images/data.iso,/data \
        -- ./nginx.bin -c /data/conf/nginx.conf

To check do a

    curl http://localhost:8000







## FROM HERE, THIS IS GARBAGE

network helper : https://github.com/rumpkernel/wiki/wiki/Howto%3A-Networking-with-if_virt

    ip tuntap add tap1 mode tap
    ip link set dev tap1 up

    # create a bridge
    brctl addbr bridge43
    brctl addif bridge43 tap1

    # IF YOU HAVE ETHERNET INTERNET ACCESS link the bridge with you internet interface
    brctl addif bridge43 eth0

    # IF YOU HAVE WIFI INTERNET ACCESS
    # activate ip forwarding
    sysctl -w net.ipv4.ip_forward=1
    # activate masquerading on internet interface
    iptables -t nat -A POSTROUTING -o wlp2s0 -j MASQUERADE
    # add ip table rules to accept incoming and outgoing packets
    iptables -I FORWARD -o wlp2s0 -s 10.0.0.0/24 -j ACCEPT
    iptables -I INPUT -s 10.0.0.0/24 -j ACCEPT

    # marche, mais sur un tap
    rumprun qemu -i -M 128 \
        -I if,vioif,'-net tap,script=no,ifname=tap1'\
        -W if,inet,static,10.0.0.101/24 \
        -b images/data.iso,/data \
        -- ./nginx.bin -c /data/conf/nginx.conf

TODO : étapes suivantes pour builder nginx...

## Tutorial nginx

https://github.com/rumpkernel/wiki/wiki/Tutorial%3A-Serve-a-static-website-as-a-Unikernel



créer une interface tap

ip tuntap add tap0 mode tap
ip addr add 10.0.120.100/24 dev tap0
ip link set dev tap0 up

(test)
ip tuntap add tap1 mode tap
ip addr add 10.0.0.100/24 dev tap1
ip link set dev tap1 up

pour vérifier : `ip addr`

export PATH=$PATH:/home/arnaud/repos/third/rumprun/rumprun/bin

rumprun qemu -i -M 128 \
        -I if,vioif,'-net tap,script=no,ifname=tap0'\
        -W if,inet,static,10.0.120.101/24 \
        -b images/data.iso,/data \
        -- ./nginx.bin -c /data/conf/nginx.conf

rumprun qemu -i -M 128 \
        -I if,vioif,'-net tap,script=no,ifname=tap1'\
        -W if,inet,static,10.0.0.101/24 \
        -b images/data.iso,/data \
        -- ./nginx.bin -c /data/conf/nginx.conf



## Etablir un bridge entre nginx et includeos en local

Lancer le includeos avec `boot --create-bridge .` pour que le script crée le bridge (normaelement identifié `bridge43`)

Plus tard il faudra créer le bridge nous-mêmes

### Création du tap1

sudo ip tuntap add tap1 mode tap
sudo ip addr add 10.0.0.100/24 dev tap1
sudo ip link set dev tap1 up
ip addr

### Ajout du tap1 au bridge IncludeOS

sudo brctl addif bridge43 tap1
ip link ls
ip addr

### Lancement NGINX sur le tap bridgé

rumprun qemu -i -M 128 \
    -I if,vioif,'-net tap,script=no,ifname=tap1' \
    -W if,inet,static,10.0.0.101/24 \
    -b images/data.iso,/data \
    -- ./nginx.bin -c /data/conf/nginx.conf


curl http://10.101
curl http://10.101/rump

## Modif de configuration NGINX

make
