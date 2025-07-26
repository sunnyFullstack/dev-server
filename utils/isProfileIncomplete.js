const isProfileIncomplete = (user) => {
  if (
    !user.firstname ||
    !user.lastname ||
    !user.mobile ||
    !user.username ||
    !user.email ||
    !user.gender ||
    !user.work_location?.state ||
    !user.work_location?.district ||
    !user.work_location?.block ||
    !user.work_location?.village ||
    !user.desired_transfer_location?.state ||
    !user.desired_transfer_location?.district ||
    !user.desired_transfer_location?.block ||
    !user.desired_transfer_location?.village ||
    !user.school_info?.school_name ||
    !user.school_info?.school_u_dise ||
    !user.teacher_code ||
    !user.class_group ||
    !user.subjectname
  ) {
    return true; // Profile is incomplete
  }

  return false; // Profile is complete
};
