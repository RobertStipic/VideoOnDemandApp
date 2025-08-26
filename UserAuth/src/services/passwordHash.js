import bcrypt from 'bcrypt';

export class PasswordEncription {
static hashPassword(password){
        try{
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);
        return hash;
        } catch (error) {
      console.error(`Unexpected password hash error: ${error.message}`);
      return; 
    }
}

static comparePassword(plainTextPassword, storedPassword){
    try{
    const passwordsMatch = bcrypt.compareSync(plainTextPassword, storedPassword);
    return passwordsMatch;
    }catch (error) {
      console.error(`Unexpected password compare error: ${error.message}`);
      return; 
    }
}
}
