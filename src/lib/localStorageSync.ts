import {
  saveAllUsersToFirestore,
  saveAllQuestionnairesToFirestore,
  saveAllResponsesToFirestore,
  saveAllAuditLogsToFirestore,
  saveAllPromotionsToFirestore,
  saveAllCheatReportsToFirestore,
  saveAllQuotaRequestsToFirestore,
  saveAllTriviaQuestionsToFirestore
} from "../utils/firebaseDb";

if (typeof window !== "undefined") {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key: string, value: string) {
    // Write locally first for zero-latency UI
    originalSetItem.apply(this, [key, value]);
    
    // Asynchronously mirror key collections to Firebase Firestore backend
    try {
      const parsed = JSON.parse(value);
      if (key === "sub_users") {
        saveAllUsersToFirestore(parsed);
      } else if (key === "sub_surveys") {
        saveAllQuestionnairesToFirestore(parsed);
      } else if (key === "sub_responses") {
        saveAllResponsesToFirestore(parsed);
      } else if (key === "sub_logs") {
        saveAllAuditLogsToFirestore(parsed);
      } else if (key === "sub_promotions") {
        saveAllPromotionsToFirestore(parsed);
      } else if (key === "global_cheat_reports") {
        saveAllCheatReportsToFirestore(parsed);
      } else if (key === "global_quota_requests") {
        saveAllQuotaRequestsToFirestore(parsed);
      } else if (key === "sub_trivia_questions") {
        saveAllTriviaQuestionsToFirestore(parsed);
      }
    } catch (e) {
      // Skip non-JSON or other simple preferences keys
    }
  };
}
