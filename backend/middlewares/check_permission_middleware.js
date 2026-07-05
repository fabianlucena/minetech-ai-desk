export default function checkPermissionMiddleware(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!requiredPermissions.some(p => req.session.permissionNames.includes(p))) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  }
}