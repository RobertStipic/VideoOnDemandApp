import bcrypt from 'bcrypt';

export class PasswordEncription {
static hashPassword(password){
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);
        //same as
        // Technique 1 (generate a salt and hash on separate function calls):
        //const salt = bcrypt.genSaltSync(saltRounds);
        //const hash = bcrypt.hashSync(myPlaintextPassword, salt);
        // Store hash in your password DB.

        return hash;
}

static comparePassword(plainTextPassword, storedPassword){
    const passwordsMatch = bcrypt.compareSync(plainTextPassword, storedPassword);
    return passwordsMatch;
}
}
