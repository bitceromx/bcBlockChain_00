
### Crear material criptográfico

Nota. Especificar en el archivo docker-compose.yaml-ORIGINAL el número de puerto 7054 para org1 y 8054 para org2  (en el apartado ica.org{NumOrg}.example.com).


```bash
cp start.sh-ORG1 start.sh
sudo ./start example org1 Org1
sudo ./destroy example org1

y

cp start.sh-ORG2 start.sh
sudo ./start example org2 Org2
sudo ./destroy example org2
```

Como salida se generan los directorios: ../ca-config-org{NumOrg} y ../org{NumOrg}.example.com respectivamente.

Con ello finaliza la generación del material criptográfico. Ahora continuar con las instrucciones del README.md del directorio superior anzen-digital-crypt/.
