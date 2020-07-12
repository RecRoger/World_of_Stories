import app from './app'

const port = parseInt(process.env.PORT || '3000')

const server = new app().Start(port)
  .then(port => {
    console.log(`******* Aplication Start *********`);
    console.log(`Server listening on port ${port}`);
    console.log(`**********************************`);
  }
  )
  .catch(error => {
    console.log(error)
    process.exit(1);
  });

export default server;


