const animalModel = require('../models/animals.model')

const Animal = {
    list: async (req, res) => {
        const animal = await animalModel.find()
        res.status(200).send(animal)
    },
    create: async (req, res) => {
        try{
            const animal = new animalModel(req.body)
            await animal.save()
            res.status(201).send('Animalito creado satisfactoriamente!')
        }catch(err){
            console.error(err.message)
        }
    },
    update: async (req, res) => {
        res.send(201).send('Ahorita mismo no tenemos esta funcion!')
    },
    destroy: async (req, res) => {
        try{
            const { id } = req.params
            const userForDelete = await animalModel.findByIdAndDelete({_id: id})
            if (!userForDelete){
                return res.status(404).send('Usuario no eliminado, algo fallo!')
            }
            return res.status(204).send('Animalito eliminado!')
        }catch(err){
            res.status(500).send(err.message)
        }
    }
}

module.exports = Animal