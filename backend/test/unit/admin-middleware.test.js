const admin = require('../../middleware/admin');
require('dotenv').config();
console.log('MONGO_URI_TEST:', process.env.MONGO_URI_TEST);

describe('Admin Middleware', () => {
  it('should deny access if user is not an admin', () => {
    const req = { isAdmin: false };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();

    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Access denied. Admins only.');
    expect(next).not.toHaveBeenCalled();
  });

  it('should grant access if user is an admin', () => {
    const req = { isAdmin: true };
    const res = {};
    const next = jest.fn();

    admin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
