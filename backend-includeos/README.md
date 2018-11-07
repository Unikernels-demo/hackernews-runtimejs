# Dummy backend for the Hacker News clone front end

It will use SQLite in Include OS inside GCP to reply with the posts payload.

## Building IncludeOS

Build the Dockerfile or execute its steps directly on your system :

        docker build . -t includeos

Copy the ̀/root/includeos` directory on your system :

If you want to test the installation, you can run this inside 

./test.sh pour vérifier le build

## Building the application

Go to the `examples/prez-db` subdirectory of includeOS

build with `./setup.sh`

launch locally with `boot --create-bridge .`

## Building the cloud image

create a bootable image with `boot -g -b .`

To create a file compatible with Google Compute Engine :

        # the file should be named 'disk.raw'
        cp build/backend_database.grub.img build/disk.raw

        cd build && tar -zcf backend_database.tar.gz disk.raw && cd ..

Upload the `backend_database.tar.gz` in a GCP bucket

In Compute Engine Image : create an image from the previous cloudstorage bucket.

In Compute / VMs : create a VM with the image as a boot disk? Don't forget to allow incoming HTTP traffic.

Call you VM and enjoy.

## Action

Choper le paquet Debian 'grub-pc-bin' pour avoir grub en 32bits

https://packages.debian.org/stretch/i386/grub-pc-bin/download

L'extraire dans un sous-répertoire tmp avec 

        dpkg --extract grub-pc-bin_2.02_beta3-5_i386.deb tmp


Création de l'image

dans le dossier du projet includeos (par exemple examples/demo_service) :

        boot -g . # crée l'image avec grub dedans


Pour lancer l'image en local

        sudo qemu-system-x86_64 \
            --enable-kvm \
            -drive file=IncludeOS_example.grub.img,format=raw,if=ide,media=disk \
            -s \
            -device virtio-net,netdev=net0,romfile= \
            -netdev tap,id=net0,vhost=on,script=/home/arnaud/includeos/includeos/scripts/qemu-ifup,downscript=/home/arnaud/includeos/includeos/scripts/qemu-ifdown \
            -m 128

(test)
sudo qemu-system-x86_64 \
        --enable-kvm \
        -drive file=backend_database.grub.img,format=raw,if=ide,media=disk \
        -s \
        -device virtio-net,netdev=tap1,romfile= \
        -m 128
