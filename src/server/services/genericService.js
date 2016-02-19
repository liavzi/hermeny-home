function GenericService(model){
    this._model = model;
}

GenericService.prototype.create = function(entity,callback){
    this._model.create(entity,callback);
};

GenericService.prototype.createOrUpdate = function(entity,callback){
    var model = this._model;
    this._model.findById(entity._id,function(err,dbEntity){
        if (err) callback(err);
        if (!dbEntity)
            model.create(entity,callback);
        else{
            delete entity._id;
            dbEntity.update(entity,callback); 
        }
    });
};

GenericService.prototype.getAll = function(query,callback){
    this._model.find({},callback);
 };

GenericService.prototype.getById = function(id,callback){
    this._model.findById(id,callback);
};

GenericService.prototype.deleteById = function(id,callback){
    this._model.findById(id).remove(callback);
};

module.exports = GenericService;

