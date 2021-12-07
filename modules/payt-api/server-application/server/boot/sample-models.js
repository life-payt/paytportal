// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = function(app) {
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  var adminid;

  User.create([
    {username: 'admin', email: 'admin@life-payt.eu', password: 'paytadmin2019'}
  ], function(err, users) {
    if (err) return err;
    adminid = users[0].id;
    console.log('Created users:', users);

  });

  //create the admin role
  Role.create({
    name: 'admin'
  }, function(err, role) {
    if (err) return err;

    console.log('Created role:', role);

    //make bob an admin
    role.principals.create({
      principalType: RoleMapping.USER,
      principalId: adminid
    }, function(err, principal) {
      if (err) return err;

      console.log('Created principal:', principal);
    });
  });

  Role.create({
    name: 'aveiro'
  }, function(err, role) {
    if (err) return err;

    console.log('Created role:', role);
  });
};
