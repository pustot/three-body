# three-body

(此项目搁置中，后端有时没在运行)

https://three-body.twaqngu.com/

Three-body problem simulation

```sh
sudo python3 -m flask run --host=0.0.0.0 --cert=/etc/letsencrypt/live/yangchnx.com/fullchain.pem --key=/etc/letsencrypt/live/yangchnx.com/privkey.pem

# sudo pip3 install gunicorn
sudo gunicorn -w 1 -b 0.0.0.0:5000 app:app --daemon --access-logfile=access.log --error-logfile=error.log --certfile=/etc/letsencrypt/live/yangchnx.com/fullchain.pem --keyfile=/etc/letsencrypt/live/yangchnx.com/privkey.pem

sudo pkill gunicorn
```