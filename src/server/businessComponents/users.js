var _ = require("underscore");
var UserRepository = (function () {
    function UserRepository() {
    }
    UserRepository.prototype.getByGoogleProfileId = function (googleProfileId, cb) {
        return cb(null, _.find(UserRepository.users, function (x) { return x.googleProfileId === googleProfileId; }));
    };
    UserRepository.prototype.getById = function (userId, cb) {
        return cb(null, _.find(UserRepository.users, function (x) { return x._id === userId; }));
    };
    UserRepository.users = [{
            _id: 1,
            googleProfileId: "102414180728342095926",
            isAdmin: true
        }];
    return UserRepository;
})();
function ensureAdminOrRedirectToLogin(req, res, next) {
    if (isAdmin(req))
        return next();
    res.redirect("/Views/managementLogin.html");
}
exports.ensureAdminOrRedirectToLogin = ensureAdminOrRedirectToLogin;
function isAdmin(req) {
    if (req.isAuthenticated() && req.user.isAdmin)
        return true;
    return false;
}
function ensureAdmin(req, res, next) {
    if (isAdmin(req))
        return next();
    res.status(401).end();
}
exports.ensureAdmin = ensureAdmin;
exports.userRepository = new UserRepository();
