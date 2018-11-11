# Nginx load balancer and reverse proxy

RumpRun is used to build and run Nginx. It will listen on the provided virtio nic on 8080 TCP port and forward incoming HTTP requests to the [frontend](../frontend-runtimejs).

## How to build

Build the docker image or execute each steps on your system (granted your environment will fit RumpRun requirements...) :

        docker build . -t rumprun


## FROM HERE, THIS IS GARBAGE

TODO : étapes suivantes pour builder nginx...

## Tutorial nginx

https://github.com/rumpkernel/wiki/wiki/Tutorial%3A-Serve-a-static-website-as-a-Unikernel

quand la compile  nginx plante, il faut retirer -Werror dans nginx/build/obs/Makefile

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
