## This is API for online-bookstore

### Enviroment

```
  - DB_LOGIN
  - DB_PASSWORD
  - DB_HOST
  - DB_PORT
  - DB_AUTHDATABASE
```

### Also you need something like this describing your rsa keys for jwt tokens

```
  keys
    - access
      - private.pem
      - public.pem
    - refresh
      - private.pem
      - public.pem
```

### Generating keys using openssl:

```
  #private
  openssl genrsa -out private.pem <keySize>

  #public
  openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```
