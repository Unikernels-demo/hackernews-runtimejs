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


qemu-system-x86_64 -m 512 -smp 1 -s -kernel /home/arnaud/.runtime/runtime.2064 -initrd .initrd -net tap,model=virtio,macaddr=1a:46:0b:ca:bc:7c -net user,net=192.168.76.0/24,dhcpstart=192.168.76.9,hostfwd=udp::9000-:9000,hostfwd=tcp::9000-:9000 -enable-kvm -no-kvm-irqchip -serial stdio


## Documentation

### Bootloading sequence

When starting, Include OS outputs that :

```
================================================================================

                           #include<os> // Literally

================================================================================
```

This is done in the `
*` file.

The bootloader does the following things (starting in real mode) :

- sets a boot data segment
- enable A20 line
- print a logo
- sets global descriptor table register. There is only two segments : code and data (https://www.felixcloutier.com/x86/LGDT:LIDT.html)
- switch to protected mode (mov eax, cr0 / or   al, 1 / mov cr0, eax) (https://en.wikipedia.org/wiki/Control_register#CR0)
- sets the kernel stack (at 0xA0000)
- position segment registers
- read sectors from the disk (through a code found here, since there is no INT 13 in protected mode, disk is by using ports and not BIOS : http://wiki.osdev.org/ATA_read/write_sectors#Read_in_LBA_mode)
- call the kernel entry point. The address of the code is written in the bootloader by the `vmbuild/vmbuild.cpp` program. In the bootloader there are 3 placeholders for three important bootstrap values : `srv_size` (size of the kernel), `srv_entry` (entry point) and `srv_load` (address where to load the kernel).
- the kernel initiates things (`kernel_start.cpp`) and starts the OS event loop (`platform/x86_pc/os.cpp`)

The OS event loop is :

```c++
Events::get(0).process_events();
do {
        OS::halt();
        Events::get(0).process_events();
} while (power_);
```

Utilise SMP pour gérer le multi coeur.

Les événements sont gérés dans `Event.cpp`. Il y a 128 evts possibles, chacun associé à une interruption.


### Bootloader creation

The bootloader file from the `bootloader.asm` file is exactly on sector in size. The ELF binary is then appended to the created disk.

The program then finds the ELF binary entry point address (depending on whether it is a 32 or 64 bit binary).

It finally writes the values in the three placeholders of the bootstrap sector and write the disk image.

### Kernel initialisation sequence

kernel.cpp

os.cpp

`src/platform/x86_pc/main.cpp`