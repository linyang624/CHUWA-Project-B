export const getMyVisaStatus = async (req, res, next) => {
    res.json({ message: "Get my visa status" });
};

export const uploadVisaDocument = async (req, res, next) => {
    res.json({ message: "Upload visa document" });
};

/*
    第一个问题就是我们刚才已经组织了语言问了老师了
    第二个问题：opt receipt我们昨天的规划就是他应该在onboarding里面提交，visa那边负责剩下的三个文件，
    因为文档写了application的字段要要求了上传receipt如果是opt
    然后application被approved了之后，同步信息到visa页面，并且可以preview/download receipt，并提醒应该继续上传ead了
    第三个问题：receipt被rej，是整个application被rej，并且说是receipt有问题，修改application，在里面重新上传
    第四个问题：这个我们商量过了，是我们db存了token信息，当我们使用这个邮箱提交application的时候，后端应该有逻辑处理，
    也就是我们用这个邮箱提交了申请，后端检测到一个被used的token里的邮箱被提交了申请，那么status状态会显示application submit这样的信息
    第五个问题：只要onboarding approved，员工信息就要进入employee file
    第六个问题：就是在onboarding传，我们做了optional字段，只是上传了的所有文件要在申请底部展示一个summary而已
    第七个问题：那么就是用户被hr approve的文件才会显示在Personal Information page 

*/