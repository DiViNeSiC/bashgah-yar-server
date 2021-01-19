exports.authController = {
    errorMsgs: {
        jwtExpired: 'jwt expired',
        serverError: 'خطا از طرف سرور',
        loginError: 'خطا در ورود به حساب',
        sendingEmailError: 'خطا در ارسال ایمیل',
        sendingCodeError: 'خطا در ارسال کد تایید',
        incorrectPassword: 'رمز عبور شما اشتباه است',
        userDidNotFound: 'کاربری با این مشخصات یافت نشد',
        invalidInformation: 'اطلاعات وارد شده نامعتبر است',
        doubleRequestError: 'درخواست متوالی قابل قبول نیست',
        unverifiedEmail: 'ایمیل وارد شده هنوز تایید نشده است',
        expiredInfo: 'زمان استفاده از این ژتون یا کد به پایان رسیده است',
    },
    successMsgs: {
        goodByeMessage: '!خدانگهدار',
        resetPassSuccess: 'رمز عبور شما تغییر گردید',
        activeAccountSuccess: 'حساب کاربری شما فعال گردید',
        updateTokenSuccess: 'ژتون احراز هویت شما بروز گردید',
        sendingCodeSuccess: 'کد تایید به شماره شما ارسال گردید',
        sendingEmailSuccess: 'ایمیل، باموفقیت برای شما ارسال گردید',
    },
    warnMsgs: {
        changeYourPass: 'برای تغییر رمز اقدام فرمایید',
        activeYourAcc: 'حساب کاربری خود را فعال نمایید',
    }
}

exports.gymController = {
    errorMsgs: {
        gymNotFound: 'باشگاهی یافت نشد',
        noPicUploaded: 'تصویری دریافت نشد',
        gymUpdateError: 'خطا در بروزرسانی مشخصات باشگاه',
        accessNotAllowed: 'شما به این بخش دسترسی ندارید',
        deleteGymAccountError: 'خطا در حذف کردن حساب باشگاه',
        gymPicLimitReached: 'درج تصویر به حداکثر تعداد رسیده است',
    },
    successMsgs: {
        gymInfoUpdated: 'اطلاعات باشگاه بروز گردید',
        gymPicsUpdated: 'تصاویر باشگاه بروز گردید',
        deleteGymAccountSuccess: 'حساب باشگاه با موفقیت حذف گردید',
    }
}

exports.communicationController = {
    errorMsgs: {
        deleteMessageError: 'خطا در حذف پیام',
        emptyMessageText: 'متن پیام خالی است',
        sendMessageError: 'خطا در ارسال پیام',
        editMessageError: 'خطا در ویرایش پیام',
        userNotFound: 'کاربری با این مشخصات یافت نشد',
        noFileOrTextFound: 'متن یا فایلی برای ارسال دریافت نشد',
        deleteMessageNotAllowed: 'شما قادر به حذف این پیام نیستید',
        editMessageNotAllowed: 'شما قادر به ویرایش این پیام نیستید',
        userInfoAccessNotAllowed: 'شما نمی توانید به اطلاعات این کاربر دسترسی داشته باشید',
    },
    successMsgs: {
        deleteMessageSuccess: 'پیام شما حذف گردید',
        editMessageSuccess: 'پیام شما ویرایش گردید',
        sendMessageSuccess: 'پیام با موفقیت ارسال شد',
    },
    warnMsgs: {
        youDoNotHaveAnyGyms: 'شما باشگاهی برای دسترسی به کاربری در آن ندارید',
    }
}

exports.registrationController = {
    errorMsgs: {
        userRegisterError: 'خطا در ایجاد حساب کاربر جدید',
        gymRegisterError: 'خطا در ایجاد حساب باشگاه جدید',
        gymIdNeeded: 'باشگاه مشخص برای ایجاد حساب کاربر نیاز است',
        wrongAdminPassword: 'رمز تایید برای ثبت حساب مدیر سایت اشتباه است',
    },
    successMsgs: {
        successSiteAdmin: 'مدیر جدید سایت ثبت شد',
        successGymAdmin: 'مدیر جدید باشگاه ثبت شد',
        successGymCoach: 'مربی جدید باشگاه ثبت شد',
        successGymAccount: 'حساب باشگاه جدید ثبت شد',
        successGymManager: 'منیجر جدید باشگاه ثبت شد',
        successGymAthlete: 'ورزشکار جدید باشگاه ثبت شد',
    }
}

exports.scheduleController = {
    errorMsgs: {
        moveNotFound: 'حرکت ورزشی ای یافت نشد',
        movesListIsEmpty: 'لیست حرکات خالی است',
        deleteMoveError: 'خطا در حذف حرکت ورزشی',
        scheduleNotFound: 'برنامه ورزشی ای یافت نشد',
        deleteScheduleError: 'خطا در حذف برنامه ورزشی',
        createScheduleError: 'خطا در ایجاد برنامه ورزشی',
        athleteNotFound: 'ورزشکاری با این مشخصات یافت نشد',
        createNewMoveError: 'خطا در ایجاد حرکت ورزشی جدید',
        scheduleUpdateError: 'خطا در بروزرسانی برنامه ورزشی',
    },
    successMsgs: {
        deleteMoveSuccess: 'حرکت ورزشی حذف گردید',
        scheduleUpdated: 'برنامه ورزشی بروز گردید',
        deleteScheduleSuccess: 'برنامه ورزشی حذف گردید',
        createNewMoveSuccess: 'حرکت ورزشی جدید ایجاد شد',
        createScheduleSuccess: 'برنامه ورزشی با موفقیت ایجاد شد',
    }
}

exports.userController = {
    errorMsgs: {
        jwtExpired: 'jwt expired',
        noAvatarFound: 'آواتاری یافت نشد',
        emptyAvatarFile: 'آواتاری دریافت نشد',
        emailChangeError: 'خطا در تغییر ایمیل',
        deleteAvatarError: 'خطا در حذف آواتار',
        changeAvatarError: 'خطا در تغییر آواتار',
        changePasswordError: 'خطا در تغییر رمز عبور',
        userNotFound: 'کاربری با این مشخصات یافت نشد',
        deleteGymStaffError: 'خطا در حذف حساب کاربر مورد نظر',
        updateCredentialsError: 'خطا در بروزرسانی اطلاعات حساب',
        emailCannotBeChanged: 'ایمیل بعد از تایید شدن نمی تواند تغییر کند',
        currentPassIncorrect: 'رمز عبور فعلی خود را اشتباه وارد نموده اید',
        changePasswordEmailSendError: 'خطا در فرستادن ایمیل تغییر رمز عبور',
        changePasswordTimeExpired: 'زمان تغییر رمز عبور شما به پایان رسیده است',
        userInfoAccessNotAllowed: 'شما نمی توانید به اطلاعات این کاربر دسترسی داشته باشید',
    },
    successMsgs: {
        emailChanged: 'ایمیل شما تغییر یافت',
        changeAvatarSuccess: 'آواتار شما بروز گردید',
        deleteAvatarSuccess: 'آواتار شما با موفقیت حذف گردید',
        passwordChanged: 'رمز عبور شما با موفقیت تغییر داده شد',
        deleteGymStaffSuccess: 'حساب کاربری مورد نظر حذف گردید',
        updateCredentialsSuccess: 'اطلاعات حساب کاربری شما بروز گردید',
        changePasswordEmailSent: 'ایمیل تغییر رمز عبور برای شما فرستاده شد',
    },
    warnMsgs: {
        youDoNotHaveAnyGyms: 'شما باشگاهی برای دسترسی به کاربری در آن ندارید',
        activeYourAccount: 'لطفا هرچه سریعتر به تایید نمودن حساب کاربری اقدام فرمایید',
    }
}

exports.handlers = {
    fileHandlers: {
        deleteAvatarFileError: 'خطا در حذف فایل آواتار',
        deleteGymPicFileError: 'خطا در حذف فایل تصویر باشگاه',
    },
    userForm: {
        nameNeeded: 'نام برای حساب نیاز است',
        emailNeeded: 'ایمیل برای حساب نیاز است',
        passwordNeeded: 'رمز عبور برای حساب نیاز است',
        usernameNeeded: 'نام کاربری برای حساب نیاز است',
        lastnameNeeded: 'نام خانوادگی برای حساب نیاز است',
        phoneNumberNeeded: 'شماره تلفن برای حساب نیاز است',
        emailLengthError: 'ایمیل باید شامل پنج کاراکتر باشد',
        emailExistError: 'کاربری دیگر با همین ایمیل وجود دارد',
        phoneNumberRegExpError: 'شماره تلفن باید شامل عدد باشد',
        passwordLengthError: 'رمز عبور باید شامل هشت کاراکتر باشد',
        usernameExistError: 'کاربری دیگر با این نام کاربری وجود دارد',
        phoneNumberExistError: 'کاربری دیگر با همین شماره تلفن وجود دارد',
        usernameLengthError: 'نام کاربری حداقل باید شامل شش کاراکتر باشد',
        phoneNumberLengthError: 'شماره تلفن نباید کمتر یا بیشتر از یازده رقم باشد',
        usernameRegExpError: 'نام کاربری باید شامل حروف انگلیسی ، (-) ، (_) و (.) باشد',
    },
    gymForm: {
        gymNameNeeded: 'نام برای باشگاه نیاز است',
        gymCityNeeded: 'انتخاب شهر برای باشگاه نیاز است',
        gymNameExist: 'باشگاهی دیگر با همین نام وجود دارد',
        gymCapacityNeeded: 'تعیین ظرفیت برای باشگاه نیاز است',
        phoneNumberRegExpError: 'شماره تلفن باید شامل عدد باشد',
        nameLengthError: 'نام باشگاه باید شامل چهار کاراکتر باشد',
        gymAddressNeeded: 'نوشتن نشانی صحیح برای باشگاه نیاز است',
        gymPhoneNumberNeeded: 'درج شماره تلفن برای باشگاه نیاز است',
        gymPhoneNumberExist: 'باشگاهی دیگر با همین شماره تلفن وجود دارد',
        gymUsersAccountDeleteError: 'خطا در حذف کردن حساب های کاربران باشگاه',
    }
}

exports.authMiddleware = {
    jwtExpired: 'jwt expired',
    serverError: 'دریافت خطا از سرور',
    loginNeeded: 'شما باید وارد حساب کاربری خود شوید',
    accessNotAllowed: 'شما نمی توانید به این بخش دسترسی داشته باشید',
}

exports.checksMiddleware = {
    paramCheckError: 'مشخصات وارد شده نادرست است',
    gymNotFound: 'باشگاهی با این مشخصات یافت نشد',
    userNotFound: 'کاربری با این مشخصات یافت نشد',
    accessNotAllowed: 'شما به این بخش دسترسی ندارید',
    accountIsVerified: 'حساب کاربری شما درحال حاضر فعال می باشد',
    gymAccessNotAllowed: 'شما به کاربران این باشگاه دسترسی ندارید',
    emailNeeded: 'برای انجام این کار نیاز به ایمیل برای حساب خود دارید',
    userDeleteAccessNotAllowed: 'شما نمی توانید حساب این کاربر را حذف کنید',
    gymsNeeded: 'شما نیاز به باشگاه برای دسترسی به حساب های کاربران آن دارید',
    accountVerifyNeeded: 'برای انجام این کار نیاز به تایید حساب کاربری خود دارید',
}