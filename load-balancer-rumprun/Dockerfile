FROM ubuntu

RUN apt update
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
        libzip-dev

RUN git clone https://github.com/ltearno/rumprun.git
RUN git clone https://github.com/rumpkernel/rumprun-packages.git

ENV PLATFORM=hw
ENV MACHINE=x86_64
ENV TESTS=qemu
ENV EXTRAFLAGS=
ENV CC=gcc

WORKDIR /rumprun
RUN git submodule update --init
RUN ./build-rr.sh -o myobj -j2 -qq ${KERNONLY} ${PLATFORM} ${EXTRAFLAGS}

# TODO : build rumprun-packages (nginx)