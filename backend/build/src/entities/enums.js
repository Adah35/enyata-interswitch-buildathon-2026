"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.MessageSenderType = exports.DisputeReason = exports.DisputeResolution = exports.DisputeStatus = exports.TransactionStatus = exports.TransactionType = exports.EscrowStatus = exports.BidStatus = exports.TaskStatus = exports.KycLevel = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["POSTER"] = "POSTER";
    UserRole["TASKER"] = "TASKER";
    UserRole["BOTH"] = "BOTH";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var KycLevel;
(function (KycLevel) {
    KycLevel["NONE"] = "NONE";
    KycLevel["BASIC"] = "BASIC";
    KycLevel["ID_VERIFIED"] = "ID_VERIFIED";
    KycLevel["PAYOUT"] = "PAYOUT";
})(KycLevel || (exports.KycLevel = KycLevel = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["DRAFT"] = "DRAFT";
    TaskStatus["OPEN"] = "OPEN";
    TaskStatus["ASSIGNED"] = "ASSIGNED";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["CANCELLED"] = "CANCELLED";
    TaskStatus["REFUNDED"] = "REFUNDED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var BidStatus;
(function (BidStatus) {
    BidStatus["PENDING"] = "PENDING";
    BidStatus["ACCEPTED"] = "ACCEPTED";
    BidStatus["REJECTED"] = "REJECTED";
    BidStatus["WITHDRAWN"] = "WITHDRAWN";
})(BidStatus || (exports.BidStatus = BidStatus = {}));
var EscrowStatus;
(function (EscrowStatus) {
    EscrowStatus["HOLDING"] = "HOLDING";
    EscrowStatus["RELEASED"] = "RELEASED";
    EscrowStatus["REFUNDED"] = "REFUNDED";
    EscrowStatus["DISPUTED"] = "DISPUTED";
})(EscrowStatus || (exports.EscrowStatus = EscrowStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["CHARGE"] = "CHARGE";
    TransactionType["TASKER_PAYOUT"] = "TASKER_PAYOUT";
    TransactionType["PLATFORM_FEE"] = "PLATFORM_FEE";
    TransactionType["REFUND"] = "REFUND";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["SUCCESS"] = "SUCCESS";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var DisputeStatus;
(function (DisputeStatus) {
    DisputeStatus["OPEN"] = "OPEN";
    DisputeStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    DisputeStatus["RESOLVED"] = "RESOLVED";
    DisputeStatus["CLOSED"] = "CLOSED";
})(DisputeStatus || (exports.DisputeStatus = DisputeStatus = {}));
var DisputeResolution;
(function (DisputeResolution) {
    DisputeResolution["TASKER_WINS"] = "TASKER_WINS";
    DisputeResolution["POSTER_WINS"] = "POSTER_WINS";
})(DisputeResolution || (exports.DisputeResolution = DisputeResolution = {}));
var DisputeReason;
(function (DisputeReason) {
    DisputeReason["INCOMPLETE"] = "INCOMPLETE";
    DisputeReason["POOR_QUALITY"] = "POOR_QUALITY";
    DisputeReason["NO_SHOW"] = "NO_SHOW";
    DisputeReason["FRAUD"] = "FRAUD";
    DisputeReason["PAYMENT_ISSUE"] = "PAYMENT_ISSUE";
})(DisputeReason || (exports.DisputeReason = DisputeReason = {}));
var MessageSenderType;
(function (MessageSenderType) {
    MessageSenderType["USER"] = "USER";
    MessageSenderType["SYSTEM"] = "SYSTEM";
})(MessageSenderType || (exports.MessageSenderType = MessageSenderType = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["TASK_BID_RECEIVED"] = "TASK_BID_RECEIVED";
    NotificationType["TASK_BID_ACCEPTED"] = "TASK_BID_ACCEPTED";
    NotificationType["TASK_BID_REJECTED"] = "TASK_BID_REJECTED";
    NotificationType["TASK_ASSIGNED"] = "TASK_ASSIGNED";
    NotificationType["TASK_STARTED"] = "TASK_STARTED";
    NotificationType["TASK_COMPLETED"] = "TASK_COMPLETED";
    NotificationType["TASK_CONFIRMED"] = "TASK_CONFIRMED";
    NotificationType["TASK_CANCELLED"] = "TASK_CANCELLED";
    NotificationType["PAYMENT_CONFIRMED"] = "PAYMENT_CONFIRMED";
    NotificationType["PAYOUT_SENT"] = "PAYOUT_SENT";
    NotificationType["PAYOUT_FAILED"] = "PAYOUT_FAILED";
    NotificationType["DISPUTE_OPENED"] = "DISPUTE_OPENED";
    NotificationType["DISPUTE_RESOLVED"] = "DISPUTE_RESOLVED";
    NotificationType["REVIEW_RECEIVED"] = "REVIEW_RECEIVED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=enums.js.map