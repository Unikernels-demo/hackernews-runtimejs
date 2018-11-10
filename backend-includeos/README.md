# Dummy backend for the Hacker News clone front end

It will use SQLite in Include OS inside GCP to reply with the posts payload.

## Building IncludeOS

Build the Dockerfile or execute its steps directly on your system :

        docker build . -t includeos

## Building the application

Copy the `/usr/local/includeos` somewhere on your system and extend your PATH to the `bin` sub directory :

        # in on terminal do that to mount the image as a container
        docker run -it --rm --name includeos includeos bash

        # in another terminal, copy the IncludeOS binary outputs (distrib and sources)
        docker cp includeos:/includeos $HOME/includeos # distrib
        docker cp includeos:/IncludeOS $HOME/IncludeOS # sources
        docker kill includeos

        # configure the environment
        export INCLUDEOS_PREFIX=$HOME/includeos
        export PATH=$PATH:$INCLUDEOS_PREFIX/bin

        # there are dependencies and maybe other packages to install depending on your configuration
        sudo apt install cmake nasm python-pip bridge-utils
        pip install jsonschema psutil junit-xml filemagic pystache antlr4-python2-runtime

        # for bootable image creation, we need the i386 grub loader
        # SORRY THE DOWNLOAD PATH IS HARDCODED :( i will fix it soon
        mkdir -p $HOME/Téléchargements/tmp
        curl http://ftp.fr.debian.org/debian/pool/main/g/grub2/grub-pc-bin_2.02~beta3-5_i386.deb -o $INCLUDEOS_PREFIX/grub-pc-bin_2.02~beta3-5_i386.deb
        dpkg --extract $INCLUDEOS_PREFIX/grub-pc-bin_2.02~beta3-5_i386.deb $HOME/Téléchargements/tmp

        # build the backend database REST appliance
        cd $HOME/IncludeOS/examples/prez-db
        ./setup.sh

## Run the image locally :

        cd $HOME/IncludeOS/examples/prez-db
        boot . --create-bridge

## Building the cloud image

create the GCP compatible bootable image

        cd $HOME/IncludeOS/examples/prez-db
        boot . -g -b
        cp build/backend_database.grub.img build/disk.raw
        cd build && tar -zcf backend_database.tar.gz disk.raw && cd ..

Upload the `build/backend_database.tar.gz` in a GCP bucket.

In Compute Engine Image : create an image from the previous cloudstorage bucket.

In Compute / VMs : create a VM with the image as a boot disk? Don't forget to allow incoming HTTP traffic.

Call you VM and enjoy.

### Run the bootable image locally

If you want to run the GCP bootable image locally with QEMU, you can do :

        sudo qemu-system-x86_64 \
            --enable-kvm \
            -drive file=build/disk.raw,format=raw,if=ide,media=disk \
            -s \
            -device virtio-net,netdev=net0,romfile= \
            -netdev tap,id=net0,vhost=on,script=/home/arnaud/includeos/includeos/scripts/qemu-ifup,downscript=/home/arnaud/includeos/includeos/scripts/qemu-ifdown \
            -m 128

        # (test)
        sudo qemu-system-x86_64 \
                --enable-kvm \
                -drive file=backend_database.grub.img,format=raw,if=ide,media=disk \
                -s \
                -device virtio-net,netdev=tap1,romfile= \
                -m 128
