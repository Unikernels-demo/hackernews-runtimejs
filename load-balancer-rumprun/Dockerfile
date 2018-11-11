FROM ubuntu

# CA MARCHE PAS AVEC DOCKER

RUN apt update
RUN apt install -y \
        git \
        sudo \
        curl \
        nasm \
        gcc \
        g++-multilib \
        cmake \
        clang-6.0 \
        libzip-dev \
        libpcre3-dev \
        libssl-dev \
        genisoimage

RUN git clone https://github.com/ltearno/rumprun.git
RUN git clone https://github.com/ltearno/rumprun-packages.git

ENV PLATFORM=hw
ENV MACHINE=x86_64
ENV TESTS=qemu
ENV EXTRAFLAGS=
ENV CC=gcc

WORKDIR /rumprun
RUN git submodule update --init
RUN ./build-rr.sh -o myobj -j8 -qq ${KERNONLY} ${PLATFORM} ${EXTRAFLAGS}

WORKDIR /rumprun-packages/nginx

# now run the image interactively, and do :
# export PATH=${PATH}:/rumprun/rumprun/bin
RUN export PATH=$PATH:/rumprun/rumprun/bin && make
#rumprun-bake hw_virtio ./nginx.bin bin/nginx

CMD bash
