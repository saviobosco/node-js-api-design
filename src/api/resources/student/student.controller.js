import { generateControllers, controllers } from '../../modules/query'
import { Student } from './student.model'

export const createOne = (model) => (req, res, next) => {
    let student = {
        id: req.body.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        date_of_birth: req.body.date_of_birth,
        class_id: req.body.class_id,
        guardian: {
          name: req.body.guardian,
          occupation: req.body.occupation_of_guardian,
          relationship: req.body.relationship_to_guardian,
          phone_number: req.body.guardian_phone_number
        }
      };
    return controllers.createOne(model, student)
      .then(doc => res.status(201).json(doc))
      .catch(error => next(error))
}

const overrides = {
    createOne: createOne(Student)
    
    
    /*function(model) {
        console.log("override function")
        console.log(this);
        return (req, res, next) => {
            var student = {
                first_name: req.body.first_name,
                last_name: req.body.first_name,
                gender: req.body.gender,
                date_of_birth: req.body.date_of_birth,
                class_id: req.body.class_id,
                guardian: {
                  name: req.body.guardian,
                  occupation: req.body.occupation_of_guardian,
                  relationship: req.body.relationship_to_guardian,
                  phone_number: req.body.guardian_phone_number
                }
              };
            console.log(req.body)
            return controllers.createOne(model, req.body)
              .then(doc => res.status(201).json(doc))
              .catch(error => next(error))
        }
    }*/
};

export default generateControllers(Student, overrides)
