db = db.getSiblingDB('admin');
db.createUser({
  user: 'adminUser',
  pwd: 'password',
  roles: [{ role: 'root', db: 'admin' }]
});