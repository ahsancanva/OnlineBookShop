const express = require('express');
const path = require('path')
const ejs = require('ejs');
const multer = require('multer')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const session = require('express-session');
const bodyParser = require('body-parser')
const randomstring = require("randomstring");
const ExcelJS = require('exceljs');


// import the schema's file
const registerSchema = require('../model/registerSchema');
const Register = require('../model/registerSchema');
const contactSchema = require('../model/contactSchema');
const Contact = require('../model/contactSchema');
const newsletterSchema = require('../model/newsletterSchema');
const Newsletter = require('../model/newsletterSchema');
const blogSchema = require('../model/blogSchema');
const Blog = require('../model/blogSchema');
const newinvoiceSchema = require('../model/newinvoiceSchema');
const Newinvoice = require('../model/newinvoiceSchema');
const departmentSchema = require('../model/department')
const Department = require('../model/department')
// authentication
const adminauth = require('../middleware/adminauth');

// router
// const adminRout = express.Router();
const adminRout = express();

//  middleware
adminRout.use(bodyParser.urlencoded({ extended: false }))
adminRout.use(bodyParser.json())
adminRout.use(session({
  secret: 'keyboard cat'
}))

// // view engine for admin
adminRout.set('view engine', 'ejs');
adminRout.set('views', './views/admin')


// ==========================================================================
// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../static/image'))
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + name) //not-working
    // cb(null, file.fieldname + name) //not-working
    // cb(null, name)  //not-working
    // cb(null, file.fieldname) //not-working
  }
})

const upload = multer({ storage: storage })
// ==========================================================================

// ==========================================================================
// secure passwodr
const securepassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash;
  } catch (err) {
    console.log(err)
  }
}


// ==========================================================================
// sendmail
const sendResetPasswordMail = async (name, email, token) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password// quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "For Reset password Mail ✔", // Subject line
      text: `WELL COME ${name}`,
      html: `Hii ${name}, Please Click Here to <a href="http://localhost:8080/admin/reset-password?token=${token}">Reset</a> Your password.
         <br><br> Please <a href="http://localhost:3000/admin/login">login</a> here....`, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}




// ====================================================================

// ==========================================================================
// sendVerifymail
const sendVerifyMail = async (name, email, user_id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password//  quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Registration Verification Mail ✔", // Subject line
      text: `WELL COME ${name}`,
      html: `Hii ${name}, Please Click Here to <a href="http://localhost:8080/verify?id=${user_id}">Verify</a> Your Mail.
         <br><br> Please <a href="http://localhost:3000/login">login</a> here....`, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}

// ==========================================================================


// ==========================================================================
// sendVerifymail
const AddNewUser = async (name, email, password, user_id) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: 'ahsan04142@gmail.com', // generated ethereal userha// hafizashan378@gmail.com  ka password ha....
        pass: 'quuvxnngkkjodfvl', // generated ethereal password// quuvxnngkkjodfvl
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'ahsan04142@gmail.com', // sender address
      to: email, // list of receivers
      subject: "Admin Add You and Verification Mail ✔", // Subject line
      text: `WELL COME ${name}`,
      html: `Hii ${name}, Please Click Here to <a href="http://localhost:8080/verify?id=${user_id}">Verify</a> Your Mail.
         <br><br> Your login Email : ${email}
         <br><br> Your login password : ${password}
        <br><br> Please <a href="http://localhost:3000/login">login</a> here....`, // html body
    });

    transporter.sendMail(info, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(`Email has been sent ${result}`)
      }
    })

  } catch (err) {
    console.log(err)
  }
}

// Authentications
adminRout.get('/', adminauth.isLogout, async (req, res) => {
  try {
    res.render('login')
  } catch (err) {
    console.log(err)
  }
})

adminRout.get('/login', adminauth.isLogout, async (req, res) => {
  try {
    res.render('login')
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await Register.findOne({ email: email });
    if (userData) {
      const isMatch = await bcrypt.compare(password, userData.password);
      if (isMatch) {
        if (userData.is_admin == 0) {
          res.render('login', { message: 'Plese verify your email' })

        }
        else {
          req.session.user_id = userData._id;
          res.redirect('/admin/admindashboard')
        }
      }
      else {
        res.render('login', { message: 'Invalid login Detailed' })

      }
    }
    else {
      res.render('login', { message: 'Invalid login Detailed' })
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.get('/logout', adminauth.isLogin, async (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/admin')
  } catch (err) {
    console.log(err)
  }
})



// ====================================================================
// forget password
adminRout.get('/forget', adminauth.isLogout, async (req, res) => {
  try {
    res.render('forget')
  } catch (err) {
    console.log(err)
  }
})


adminRout.post('/forget', adminauth.isLogout, async (req, res) => {
  try {
    const email = req.body.email;
    const forgetData = await Register.findOne({ email });
    if (forgetData) {
      if (forgetData.is_admin == 0) {
        res.render('forget', { message: 'Please Verify Your mail' })
      }
      else {
        const randomString = randomstring.generate();
        const updateData = await Register.updateOne({ email }, { $set: { token: randomString } });
        sendResetPasswordMail(forgetData.name, forgetData.email, randomString);
        res.render('forget', { message: 'Please check Your mail. To Reset Your password' })
      }
    }
    else {
      res.render('forget', { message: 'User email not valid' })
    }

  } catch (err) {
    console.log(err)
  }
})



// Reset password
adminRout.get('/reset-password', adminauth.isLogout, async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await Register.findOne({ token });
    if (tokenData) {
      res.render('reset-password', { user_id: tokenData._id });
    }
    else {
      res.render('err', { message: 'Invalid Detailed' })
    }

  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/reset-password', async (req, res) => {
  try {
    const password = req.body.password;
    const user_id = req.body.user_id;

    const secure_password = await securepassword(password);
    const updatedData = await Register.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_password, token: '' } })
    res.redirect('/admin')
  } catch (err) {
    console.log(err)
  }
})

//Mail Verification
adminRout.get('/verification', adminauth.isLogout, async (req, res) => {
  try {
    res.render('verification')
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/verification', async (req, res) => {
  try {
    const email = req.body.email;
    const MailVeri = await Register.findOne({ email });
    if (MailVeri) {
      // jo hum ne phale registration me mail ko verify kiya tha....
      // ussi method ko istmal karen ga............
      // Note:: laken SaveUser variable ki jgah MailVeri Variable ko use karen ga......
      sendVerifyMail(MailVeri.name, MailVeri.email, MailVeri._id);
      res.render('verification', { message: 'Please check Your E-mail and Verify your mail' })

    }
    else {
      res.render('verification', { message: 'Invalid Detailed' })
    }
  } catch (err) {
    console.log(err)
  }
})



// admin dashboard 
adminRout.get('/admindashboard', adminauth.isLogin, async (req, res) => {
  try {

    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('admindashboard', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// // dashboard userlist ===> show user list
// adminRout.get('/user_list',adminauth.isLogin,async (req, res) => {
//   try {
//     const userData = await Register.find({is_admin:0});
//     res.render('user_list',{user:userData})
//   } catch (err) {
//     console.log(err)
//   }
// })

// adminprofile link
adminRout.get('/profile', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('profile', { user: userData })
  } catch (err) {
    console.log(err)
  }
})



//admin edit profile
adminRout.get('/edit', adminauth.isLogin, async (req, res) => {
  try {
    // const id = req.query.id;
    const editData = await Register.findById({ _id: req.query.id });
    if (editData) {
      res.render('edit', { user: editData })
    }
    else {
      res.redirect('/admin/profile')
    }
  } catch (err) {
    console.log(err)
  }
})


// admin update the profile
adminRout.post('/edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Register.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        image: req.file.filename,
        email: req.body.email,
      }
    });
    res.redirect('/admin/profile')
  } catch (err) {
    console.log(err)
  }
})


// dashboard userlist ===> show user list and search
adminRout.get('/user_list', adminauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Register.find({
      is_admin: 0,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Register.find({
      is_admin: 0,
      $or: [
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('user_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})


// Add New User through Admin
adminRout.get('/user_add', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('user_add', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


adminRout.post('/user_add', upload.single('image'), async (req, res) => {
  try {
    const password = randomstring.generate(8);
    const spassword = await securepassword(password);
    const addUser = new Register({
      name: req.body.name,
      mobile: req.body.mobile,
      image: req.file.filename,
      email: req.body.email,
      password: spassword,
      is_admin: 0
    });

    const UserSave = await addUser.save();
    if (UserSave) {
      AddNewUser(UserSave.name, UserSave.email, UserSave.password, UserSave._id);
      res.redirect('/admin/user_list')
    }
    else {
      res.render('user_add', { message: 'Something WentWrong' })
    }
  } catch (err) {
    console.log(err)
  }
})


adminRout.get('/user_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.query.id })
    res.render('user_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})


// edit user by amdin 
adminRout.get('/user_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Register.findById({ _id: id })
    if (userData) {
      res.render('user_edit', { user: userData });
    }
    else {
      res.redirect('/admin/user_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/user_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Register.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        name: req.body.name,
        mobile: req.body.mobile,
        is_verified: req.body.verify,
        image: req.file.filename,
        email: req.body.email

      }
    });
    res.redirect('/admin/user_list')
  } catch (err) {
    console.log(err)
  }
})


// delete user by amdin 
adminRout.get('/user_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Register.deleteOne({ _id: id });
    res.redirect('/admin/user_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
adminRout.get('/user_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Mobile', key: 'mobile' },
      { header: 'Image', key: 'image' },
      { header: 'Is_Admin', key: 'is_admin' },
      { header: 'Is_verified', key: 'is_verified' },
    ];


    let counter = 1;
    const userData = await Register.find({ is_admin: 0 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})

// adminRout.get('*', adminauth.isLogout, async (req, res) => {
//   try {
//     res.redirect('/')
//   } catch (err) {
//     console.log(err)
//   }
// })


// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// ==================================================================================
// all departement 

adminRout.get('/department', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('department', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
adminRout.post('/department', upload.single('image'), async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const User = new Department({
      title: req.body.title,
      author: req.body.author,
      image: req.file.filename,
      category: req.body.category,
      description: req.body.description,
      doctor: 1,
      is_admin: 0
    });

    const UserSave = await User.save();
    if (UserSave) {
        res.redirect('/admin/doctor_list')
      }
    else {
      res.render('department', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})



//Doctor Module
adminRout.get('/doctor_list', adminauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Department.find({
      doctor: 1,
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } },
        {author: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Department.find({
      doctor: 1,
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } },
        { author: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('doctor_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})

// doctor view
adminRout.get('/doctor_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Department.findById({ _id: req.query.id })
    res.render('doctor_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/doctor_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Department.findById({ _id: id })
    if (userData) {
      res.render('doctor_edit', { user: userData });
    }
    else {
      res.redirect('/admin/doctor_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/doctor_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Department.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        title: req.body.title,
        author: req.body.author,
        image: req.file.filename,
        category: req.body.category,
        description: req.body.description,
        doctor: 1,
        is_admin: 0
      }
    });
    res.redirect('/admin/doctor_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/doctor_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Department.deleteOne({ _id: id });
    res.redirect('/admin/doctor_list')
  } catch (err) {
    console.log(err)
  }
})


// Export data in excel form
adminRout.get('/doctor_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'title', key: 'title' },
      { header: 'author', key: 'author' },
      { header: 'image', key: 'image' },
      { header: 'category', key: 'category' },
      { header: 'description', key: 'description' },
    ];


    let counter = 1;
    const userData = await Department.find({ doctor: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})





// blog Module 
// =============================================================

adminRout.get('/blog', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('blog', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
adminRout.post('/blog', upload.single('image'), async (req, res) => {
  try {
    const User = new Blog({
      image: req.file.filename,
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      blog: 1
    });

    const UserSave = await User.save();
    if (UserSave) {
      res.redirect('/admin/blog_list')
    }
    else {
      res.render('blog', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/blog_list', adminauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Blog.find({
      blog: 1,
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Blog.find({
      blog: 1,
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('blog_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})

adminRout.get('/blog_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Blog.findById({ _id: req.query.id })
    res.render('blog_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/blog_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Blog.findById({ _id: id })
    if (userData) {
      res.render('blog_edit', { user: userData });
    }
    else {
      res.redirect('/admin/blog_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/blog_edit', upload.single('image'), async (req, res) => {
  try {
    const updateData = await Blog.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        image: req.file.filename,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        blog: 1
      }
    });
    res.redirect('/admin/blog_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/blog_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Blog.deleteOne({ _id: id });
    res.redirect('/admin/blog_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/blog_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'title', key: 'title' },
      { header: 'description', key: 'description' },
      { header: 'date', key: 'date' },
    ];


    let counter = 1;
    const userData = await Blog.find({ blog: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})


// invoice Module 
// =============================================================
// =============================================================
// =============================================================
// =============================================================

adminRout.get('/newinvoice', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Register.findById({ _id: req.session.user_id })
    res.render('newinvoice', { user: userData })
  } catch (err) {
    console.log(err)
  }
})
adminRout.post('/newinvoice', async (req, res) => {
  try {
    const User = new Newinvoice({
      date: req.body.date,
      name: req.body.name,
      fathername: req.body.fathername,
      id_card: req.body.id_card,
      product_name: req.body.product_name,
      unit: req.body.unit,
      price: req.body.price,
      amount: req.body.amount,
      total: req.body.total,
      newinvoice: 1,
    });

    const UserSave = await User.save();
    if (UserSave) {
      res.redirect('/admin/newinvoice_list')
    }
    else {
      res.render('newinvoice', { message: 'Something Went Wrong' })
    }
  } catch (err) {
    console.log(err)
  }
})

// dashboard userlist ===> show user list and search
adminRout.get('/newinvoice_list', adminauth.isLogin, async (req, res) => {
  try {
    // for searching
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    // for pagination
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    const limit = 5;


    const userData = await Newinvoice.find({
      newinvoice: 1,
      $or: [
        { product_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();


    const count = await Newinvoice.find({
      newinvoice: 1,
      $or: [
        { product_name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        // { mobile: { $regex: '.*' + search + '.*', $options: 'i' } } //not working
      ]
    }).countDocuments();

    res.render('newinvoice_list', {
      user: userData,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previous: page - 1,
      next: page + 1
    })
  } catch (err) {
    console.log(err)
  }
})

adminRout.get('/newinvoice_view', adminauth.isLogin, async (req, res) => {
  try {
    const userData = await Newinvoice.findById({ _id: req.query.id })
    res.render('newinvoice_view', { user: userData })
  } catch (err) {
    console.log(err)
  }
})

// edit user by amdin 
adminRout.get('/newinvoice_edit', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await Newinvoice.findById({ _id: id })
    if (userData) {
      res.render('newinvoice_edit', { user: userData });
    }
    else {
      res.redirect('/admin/newinvoice_list')
    }
  } catch (err) {
    console.log(err)
  }
})

adminRout.post('/newinvoice_edit', async (req, res) => {
  try {
    const updateData = await Newinvoice.findByIdAndUpdate({ _id: req.body.user_id }, {
      $set: {
        date: req.body.date,
        name: req.body.name,
        fathername: req.body.fathername,
        id_card: req.body.id_card,
        product_name: req.body.product_name,
        unit: req.body.unit,
        price: req.body.price,
        amount: req.body.amount,
        total: req.body.total,
        newinvoice: 1,
      }
    });
    res.redirect('/admin/newinvoice_list')
  } catch (err) {
    console.log(err)
  }
})

// delete user by amdin 
adminRout.get('/newinvoice_delete', adminauth.isLogin, async (req, res) => {
  try {
    const id = req.query.id;
    const deleteUser = await Newinvoice.deleteOne({ _id: id });
    res.redirect('/admin/newinvoice_list')
  } catch (err) {
    console.log(err)
  }
})

// Export data in excel form
adminRout.get('/newinvoice_export', adminauth.isLogin, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'Sr.no', key: 'sr_no' },
      { header: 'date', key: 'date' },
      { header: 'name', key: 'name' },
      { header: 'fathername', key: 'fathername' },
      { header: 'id_card', key: 'id_card' },
      { header: 'product_name', key: 'product_name' },
      { header: 'unit', key: 'unit' },
      { header: 'price', key: 'price' },
      { header: 'amount', key: 'amount' },
    ];


    let counter = 1;
    const userData = await Newinvoice.find({ newinvoice: 1 });
    userData.forEach((user) => {
      user.sr_no = counter;
      worksheet.addRow(user);

      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    });

    res.setHeader(
      "content-type",
      "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    );
    res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })


  } catch (err) {
    console.log(err)
  }
})




module.exports = adminRout;







