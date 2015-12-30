* Summary of set up
=======
Commands to create an autosigned SSL certificate
```
openssl genrsa -out radiosoo-2015-key.pem 2048
openssl req -new -sha256 -key radiosoo-2015-key.pem -out radiosoo-2015-csr.pem
openssl x509 -req -in radiosoo-2015-csr.pem -signkey radiosoo-2015-key.pem -out radiosoo-2015-cert.pem
```
