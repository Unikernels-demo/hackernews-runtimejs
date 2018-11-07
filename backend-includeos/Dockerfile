FROM ubuntu

RUN apt update
RUN apt install -y \
        git \
        clang-6.0 \
        sudo \
        curl \
        nasm \
        bridge-utils \
        qemu \
        jq \
        python-pip \
        gcc \
        g++-multilib \
        cmake \
        clang-5.0

RUN git clone https://github.com/ltearno/IncludeOS.git

RUN export INCLUDEOS_PREFIX=~/includeos
RUN export PATH=$PATH:/home/arnaud/includeos/bin
RUN export CC="clang-6.0"
RUN export CXX="clang++-6.0"

WORKDIR /IncludeOS
RUN git checkout edba5c564e68f2fa903d61274694d4754e035317
RUN pip install jsonschema psutil junit-xml filemagic pystache antlr4-python2-runtime
RUN export LANG=C.UTF-8 && ./install.sh -n -y

CMD bash