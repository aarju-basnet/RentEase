const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')
const sendEmail = require('../utils/mailer')
const { welcomeTemplate} = require('../utils/welcomeEmail')
const {otpTemplate} = require('../utils/resetpasswordTemplate') 

async function register(req, res) {
    
    const { name, email, password, phone, role } = req.body;
    console.log(req.body)

   
    if (!name || !email || !password || !phone || !role) {
        return res.status(400).json({
            success: false,
            message: "All fields (Name, Email, Password, Phone, Role) are required"
        });
    }

    try {
        // 3. Check if user already exists
        const isUserExists = await userModel.findOne({ email });
        if (isUserExists) {
            return res.status(401).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // 4. Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 5. Create the user in MongoDB 
        // Mapping frontend keys to the Schema keys defined in userModel.js
        const user = await userModel.create({
            fullName: name,
    email: email.toLowerCase(),
    password: hashedPassword,
    phoneNumber: phone,
    role: role.toLowerCase()          
        });

        // 6. Generate JWT Token
        const token = jwt.sign(
            { id: user._id , role: user.role}, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

       sendEmail({
            email: user.email,
            subject: "Welcome to RentEase Nepal! 🇳🇵",
            html: welcomeTemplate(user.fullName, user.role)
        })

        // 8. Final Success Response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                _id: user._id,
                name: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
      
        console.error("Registration Controller Error:", error);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error during registration",
            error: error.message 
        });
    }
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Both fields are required"
    })
  }

  try {
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    
    const token = jwt.sign(
      { id: user._id , role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role 
      }
    })
  } catch (error) {
    console.error("Login Error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

async function logout(req,res){
  try{
    res.status(200).json({
      success:true,
      message:"user logged out successfully"
    })
  }catch{
    return res.status(500).json({
      success:False,
      message:"Internal server error"
    })
  }
}

async function logout(req,res){
    try{
        res.status(200).json({
            success:true,
            message:"user logged out successfully"
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

async function sendotp(req,res){
    const{email} = req.body
    if(!email){
        return res.status(400).json({
            success:false,
            message:"email is required"
        })
    }

    try{
        const user = await userModel.findOne({
            email
        })
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
       const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetpassword = otp
        user.resetpasswordexpiredAt = Date.now()+10*60*1000
        await user.save()

       await sendEmail({
        email: user.email,
        subject: "🔐 Reset Your Password - RentEase OTP",
        html: otpTemplate(user.fullName, otp) // Passing fullName here fixes the "Hello User" issue
    });

    
    return res.status(200).json({
      success: true,
      message: "OTP sent to email"
    });

    }catch(err){
         console.log("SEND OTP ERROR:", err); 
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

async function verifyotp(req, res) {
    // 1. Match names with frontend: use 'password' instead of 'newPassword'
    const { email, otp, password } = req.body;

    // 2. Correct the check: Error if ANY of these are missing (!)
    if (!email || !otp || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields (email, otp, password) are required"
        });
    }

    try {
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 3. OTP Validation
        if (!user.resetpassword || user.resetpassword !== otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is not valid"
            });
        }

        // 4. Expiry Validation
        if (user.resetpasswordexpiredAt < Date.now()) {
            return res.status(400).json({
                success: false, // Changed from False to false
                message: "OTP has expired"
            });
        }

        // 5. Hash and Save (Use 'password' from the destructuring above)
        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.resetpassword = '';
        user.resetpasswordexpiredAt = 0;

        await user.save();

        return res.status(200).json({ // 200 is standard for successful updates
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (err) {
        console.error("VERIFY OTP ERROR:", err);
        return res.status(500).json({
            success: false, // Changed from False to false
            message: "Internal server error"
        });
    }
}


module.exports = { register ,
    login,
    logout,
    sendotp,
    verifyotp
}

