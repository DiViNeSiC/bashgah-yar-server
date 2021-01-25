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
        userIsBanned: 'حساب کاربری شما بسته شده است. نمی توانید وارد حساب خود شوید',
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
        banGymError: 'خطا در بستن باشگاه',
        noPicUploaded: 'تصویری دریافت نشد',
        unBanGymError: 'خطا در باز کردن باشگاه',
        gymAlreadyBanned: 'باشگاه در حال حاضر بسته است',
        gymAlreadyUnBanned: 'باشگاه در حال حاضر باز است',
        accessNotAllowed: 'شما به این بخش دسترسی ندارید',
        gymUpdateError: 'خطا در بروزرسانی مشخصات باشگاه',
        deleteGymAccountError: 'خطا در حذف کردن حساب باشگاه',
        gymAccessNotAllowed: 'شما به این باشگاه دسترسی ندارید',
        gymPicLimitReached: 'درج تصویر به حداکثر تعداد رسیده است',
        setAccessTokenError: 'خطا در بروزرسانی ژتون ورودی باشگاه',
        gymHolidaysUpdateError: 'خطا در بروزرسانی روز های تعطیل باشگاه',
        holidaysLengthReached: 'تعداد روز های تعطیل نمی تواند بیشتر از هفت باشد',
    },
    successMsgs: {
        banGymSuccess: 'باشگاه مورد نظر بسته شد',
        unBanGymSuccess: 'باشگاه مورد نظر باز شد',
        gymInfoUpdated: 'اطلاعات باشگاه بروز گردید',
        gymPicsUpdated: 'تصاویر باشگاه بروز گردید',
        deleteGymAccountSuccess: 'حساب باشگاه با موفقیت حذف گردید',
        setAccessTokenSuccess: 'ژتون ورودی باشگاه با موفقیت بروز گردید',
        gymHolidaysUpdateSuccess: 'روز های تعطیل باشگاه با موفقیت بروز گردید',
    }
}

exports.communicationController = {
    errorMsgs: {
        deleteMessageError: 'خطا در حذف پیام',
        emptyMessageText: 'متن پیام خالی است',
        sendMessageError: 'خطا در ارسال پیام',
        editMessageError: 'خطا در ویرایش پیام',
        userNotFound: 'کاربری با این مشخصات یافت نشد',
        messageNotFound: 'پیامی با این مشخصات یافت نشد',
        noFileOrTextFound: 'متن یا فایلی برای ارسال دریافت نشد',
        deleteMessageNotAllowed: 'شما قادر به حذف این پیام نیستید',
        editMessageNotAllowed: 'شما قادر به ویرایش این پیام نیستید',
        markAsReadError: 'خطا در علامت زدن پیام به عنوان خوانده شده',
        messageAlreadyMarkedAsRead: 'پیام در حال حاضر خوانده شده است',
        unMarkAsReadError: 'خطا در علامت زدن پیام به عنوان خوانده نشده',
        userInfoAccessNotAllowed: 'شما نمی توانید به اطلاعات این کاربر دسترسی داشته باشید',
        markMessageNotAllowed: 'شما نمی توانید این پیام را به عنوان خوانده شده علامت بزنید',
        unMarkMessageNotAllowed: 'شما نمی توانید این پیام را به عنوان خوانده نشده علامت بزنید',
        messageAlreadyUnMarkedAsRead: 'پیام در حال حاضر به عنوان خوانده نشده علامت زده شده است',
    },
    successMsgs: {
        deleteMessageSuccess: 'پیام شما حذف گردید',
        editMessageSuccess: 'پیام شما ویرایش گردید',
        sendMessageSuccess: 'پیام با موفقیت ارسال شد',
        messageMarkedAsRead: 'پیام به عنوان خوانده شده علامت زده شد',
        messageUnMarkedAsRead: 'پیام به عنوان خوانده نشده علامت زده شد',
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
        holidaysLengthReached: 'تعداد روز های تعطیل نمی تواند بیشتر از هفت باشد',
    },
    successMsgs: {
        successSiteAdmin: 'مدیر جدید سایت ثبت شد',
        successGymAdmin: 'مدیر جدید باشگاه ثبت شد',
        successGymCoach: 'مربی جدید باشگاه ثبت شد',
        successGymAccount: 'حساب باشگاه جدید ثبت شد',
        successGymManager: 'منیجر جدید باشگاه ثبت شد',
        successSiteMedic: 'پزشک جدید برای سایت ثبت شد',
        successGymAthlete: 'ورزشکار جدید باشگاه ثبت شد',
        successSiteSupport: 'پشتیبان جدید برای سایت ثبت شد',
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
        markSessionError: 'خطا در عملیات حاضری زدن',
        changePasswordError: 'خطا در تغییر رمز عبور',
        userNotFound: 'کاربری با این مشخصات یافت نشد',
        banUserError: 'خطا در بستن حساب کاربر مورد نظر',
        athleteNotFound: 'ورزشکاری با این مشخصات یافت نشد',
        editSessionError: 'خطا در ویرایش تعداد جلسات ورزشکار',
        unBanUserError: 'خطا در باز کردن حساب کاربر مورد نظر',
        deleteGymStaffError: 'خطا در حذف حساب کاربر مورد نظر',
        updateCredentialsError: 'خطا در بروزرسانی اطلاعات حساب',
        sessionNumberInvalid: 'تعداد جلسات باید بزرگ تر از صفر باشد',
        userAlreadyBanned: 'حساب کاربر مورد نظر در حال حاضر بسته می باشد',
        emailCannotBeChanged: 'ایمیل بعد از تایید شدن نمی تواند تغییر کند',
        currentPassIncorrect: 'رمز عبور فعلی خود را اشتباه وارد نموده اید',
        changePasswordEmailSendError: 'خطا در فرستادن ایمیل تغییر رمز عبور',
        userAlreadyNotBanned: 'حساب کاربر مورد نظر در حال حاضر باز می باشد',
        changePasswordTimeExpired: 'زمان تغییر رمز عبور شما به پایان رسیده است',
        athleteDoNotHaveRemainingSessions: 'تعداد جلسات ورزشکار مورد نظر به اتمام رسیده',
        userInfoAccessNotAllowed: 'شما نمی توانید به اطلاعات این کاربر دسترسی داشته باشید',
    },
    successMsgs: {
        emailChanged: 'ایمیل شما تغییر یافت',
        changeAvatarSuccess: 'آواتار شما بروز گردید',
        deleteAvatarSuccess: 'آواتار شما با موفقیت حذف گردید',
        editSessionSuccess: 'تعداد جلسات ورزشکار تغییر گردید',
        markSessionSuccess: 'عملیات حاضری زدن موفقیت امیز بود',
        deleteGymStaffSuccess: 'حساب کاربری مورد نظر حذف گردید',
        passwordChanged: 'رمز عبور شما با موفقیت تغییر داده شد',
        banUserSuccess: 'حساب کاربر مورد نظر با موفقیت بسته شد',
        unBanUserSuccess: 'حساب کاربر مورد نظر با موفقیت باز شد',
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
    },
    checkAccesses: {
        gymNotFound: 'باشگاهی با این مشخصات یافت نشد',
        gymAccessNotAllowed: 'شما به این باشگاه دسترسی ندارید',
        userAccessNotAllowed: 'شما به حساب این کاربر دسترسی ندارید',
        gymsNeeded: 'شما نیاز به باشگاه برای دسترسی به حساب های کاربران آن دارید',
        gymAccessTokenHasExpired: 'مهلت استفاده از ژتون ورودی این باشگاه به پایان رسیده است',
        gymIsBanned: 'باشگاه شما بسته شده است. بنابراین قادر به استفاده از امکانات سایت نیستید',
        gymAdminIsBanned: 'حساب مدیر باشگاه شما بسته شده است. بنابراین قادر به استفاده از امکانات سایت نیستید',
    },
    cronJobs: {
        jwtExpired: 'jwt expired',
        allUsersMessagesUpdated: 'All Users Messages Updated',
        gymPaymentWarnSent: 'Gym Payment Warn Sent To GymAdmin',
        automatedMessagesDeleted: 'All Automated Messages Deleted',
        gymAccessTokenRemoveError: 'Failed To Remove Gym AccessToken',
        PayYourAccessTokenWarn: 'لطفا برای پرداخت ژتون اقدام فرمایید',
        allUsersMessagesUpdateFailed: 'All Users Messages Update Failed',
        automatedMessagesDeleteFailed: 'Automated Messages Delete Failed',
        gymPaymentWarnSendingError: 'Cannot Send A Warn Message To GymAdmin',
        gymAccessTokenRemoved: 'Gym AccessToken And Expire Date Removed And Expired',
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
    userNotFound: 'کاربری با این مشخصات یافت نشد',
    accessNotAllowed: 'شما به این بخش دسترسی ندارید',
    accountIsVerified: 'حساب کاربری شما درحال حاضر فعال می باشد',
    emailNeeded: 'برای انجام این کار نیاز به ایمیل برای حساب خود دارید',
    accountVerifyNeeded: 'برای انجام این کار نیاز به تایید حساب کاربری خود دارید',
}

exports.communicationsMiddleware = {
    userNotFound: 'کاربری برای ارسال پیام یافت نشد',
    sendMessageNotAllowed: 'شما به این بخش دسترسی ندارید',
}