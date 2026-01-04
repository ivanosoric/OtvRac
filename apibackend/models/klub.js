const mongoose = require('mongoose')


const TrenerSchema = new mongoose.Schema(
  {
    Ime: {
      type: String,
      required: true,
      trim: true
    },
    Prezime: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const IgracSchema = new mongoose.Schema(
  {
    Ime: {
      type: String,
      required: true,
      trim: true
    },
    Prezime: {
      type: String,
      required: true,
      trim: true
    },
    Pozicija: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const KlubSchema = new mongoose.Schema(
  {
    Naziv: {
      type: String,
      required: true,
      unique: true
    },
    Grad: {
      type: String,
      required: true
    },
    Država: {
      type: String,
      required: true
    },
    Sport: {
      type: String,
      required: true
    },
    Liga: {
      type: String,
      required: true
    },
    Godina_osnutka: {
      type: Number,
      required: true,
      min: 1800
    },
    Stadion_dvorana: {
      type: String,
      required: true
    },
    Kapacitet: {
      type: Number,
      required: true,
      min: 0
    },
    Glavni_trener: {
      type: TrenerSchema,
      required: true
    },
    Naslovi_prvaka: {
      type: Number,
      default: 0,
      min: 0
    },
    Igrači: {
      type: [IgracSchema],
      default: []
    }
  },
  {
    timestamps: true,
    collection: "klubovi"
  }
);

module.exports = mongoose.model("Klub", KlubSchema)
