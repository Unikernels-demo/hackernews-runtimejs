# A Unikernel micro-services distributed application demonstration

This is a simple application composed of three micro-services, each of them implemented through the *unikernel* paradigm :

- [Load balancer](load-balancer-rumprun) : an Nginx instance running inside a Rump kernel through RumpRun, running in kvm,
- [Front end](frontend-runtimejs) : a Javascript HackerNews clone running inside RuntimeJS, in kvm,
- [Back end](backend-includeos) : a sqlite instance exposing a REST api running inside IncludeOS, running in a Google Compute Engine VM.

## Demonstration

```bash

# backend on gcp - includeos
cd /home/arnaud/repos/third/IncludeOS/examples/prez-db
# montrer le code
# build dependencies
# ./setup.sh (inutile pour la démo)
# build and launch locally
boot . --create-bridge
curl http://10.0.0.42/api/posts | jq
# build for gcp
boot . -b -g
cp build/backend_database.grub.img build/disk.raw
cd build && tar -zcf backend_database.tar.gz disk.raw && cd ..

# Notice the 3.5 Mb size !
ls -la build/backend_database.tar.gz

# Upload the `build/backend_database.tar.gz` in a GCP bucket.
gsutil cp build/backend_database.tar.gz gs://iuyzeecbcihqkjshxg/

# Create an image from the previous cloudstorage bucket.
gcloud compute images create image-include-os --project=imposing-ratio-260511 --source-uri=https://storage.googleapis.com/iuyzeecbcihqkjshxg/backend_database.tar.gz

# Create a VM with the image as a boot disk, Don't forget to allow incoming HTTP traffic.
gcloud beta compute --project=imposing-ratio-260511 instances create instance-include-os --zone=europe-west1-b --machine-type=n1-standard-1 --subnet=default --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --tags=http-server,https-server --image=image-include-os --image-project=imposing-ratio-260511

gcloud compute --project=imposing-ratio-260511 firewall-rules create default-allow-http --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:80 --source-ranges=0.0.0.0/0 --target-tags=http-server

gcloud compute --project=imposing-ratio-260511 firewall-rules create default-allow-https --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:443 --source-ranges=0.0.0.0/0 --target-tags=https-server

# Show serial port output
# go to it with the browser

# front end : start runtimejs
cd /home/arnaud/repos/persos/hackernews-runtimejs/frontend-runtimejs
# montrer index.js
./node_modules/.bin/runtime start
# dans un navigateur aller sur http://localhost:9000
# montrer que localhost:8000 est inacessible

# load balancer : rumprun
cd /home/arnaud/repos/third/rumprun-packages/nginx
# montrer images/data/conf/nginx.conf
# ajuster l'ip locale
# mettre l'ip de la machine GCP
rm images/data.iso
make
rumprun qemu -i -M 128 \
    -I if,vioif,'-net user,net=192.168.76.0/24,dhcpstart=192.168.76.9,hostfwd=tcp::8000-:80' \
    -W if,inet,dhcp \
    -b images/data.iso,/data \
    -- ./nginx.bin -c /data/conf/nginx.conf
# dans un navigateur, aller sur http://localhost:8000
```



# A voir

ukvm
solo5
mirageos
