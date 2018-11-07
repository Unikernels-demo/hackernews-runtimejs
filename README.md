# A Unikernel micro-services distributed application demonstration

This is a simple application composed of three micro-services, each of them implemented through the *unikernel* paradigm :

- [Load balancer](load-balancer-rumprun) : an Nginx instance running inside a Rump kernel through RumpRun, running in kvm,
- [Front end](frontend-runtimejs) : a Javascript HackerNews clone running inside RuntimeJS, in kvm,
- [Back end](backend-includeos) : a sqlite instance exposing a REST api running inside IncludeOS, running in a Google Compute Engine VM.

