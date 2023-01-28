// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { connectToDatabase } from '../../../libs/mongodb';

export default async function handler(req, res) {
  const { database } = await connectToDatabase();
  const collection = database.collection('allGenes');

  const species = req.query.val[0];
  const gene = req.query.val[1];
  let query = {};
  if (species != '0') {
    query['species'] = { $regex: species, $options: 'i' };
  }
  if (gene != '0') {
    query['gene'] = { $regex: gene, $options: 'i' };
  }
  const results = await collection.find(query).limit(1000).toArray();
  res.status(200).json(results);
}
