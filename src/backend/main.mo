import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type TherapistProfile = {
    name : Text;
    tagline : Text;
    bio : Text;
    photo : Blob;
  };

  public type CVEntry = {
    id : Text;
    title : Text;
    organization : Text;
    yearRange : Text;
    description : Text;
    type_ : CVType;
  };

  public type CVType = {
    #education;
    #experience;
    #certification;
  };

  public type SessionContentItem = {
    id : Text;
    title : Text;
    description : Text;
    iconName : Text;
  };

  public type PricingPackage = {
    id : Text;
    name : Text;
    duration : Text;
    price : Float;
    description : Text;
    bulletPoints : [Text];
    highlighted : Bool;
  };

  public type ContactFormSubmission = {
    id : Text;
    name : Text;
    email : Text;
    phone : ?Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type Time = Time.Time;

  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type FormId = Text;

  public type AccessConfig = {
    admin : Principal;
  };

  public type UserProfile = {
    name : Text;
  };

  module CVEntry {
    func compare(entry1 : CVEntry, entry2 : CVEntry) : Order.Order {
      Text.compare(entry1.id, entry2.id);
    };

    public func compareByTitle(entry1 : CVEntry, entry2 : CVEntry) : Order.Order {
      Text.compare(entry1.title, entry2.title);
    };

    public func compareByYearRange(entry1 : CVEntry, entry2 : CVEntry) : Order.Order {
      Text.compare(entry1.yearRange, entry2.yearRange);
    };
  };

  module SessionContentItem {
    func compare(item1 : SessionContentItem, item2 : SessionContentItem) : Order.Order {
      Text.compare(item1.id, item2.id);
    };

    public func compareByTitle(item1 : SessionContentItem, item2 : SessionContentItem) : Order.Order {
      Text.compare(item1.title, item2.title);
    };
  };

  module PricingPackage {
    func compare(pkg1 : PricingPackage, pkg2 : PricingPackage) : Order.Order {
      Text.compare(pkg1.id, pkg2.id);
    };

    public func compareByName(pkg1 : PricingPackage, pkg2 : PricingPackage) : Order.Order {
      Text.compare(pkg1.name, pkg2.name);
    };

    public func compareByPrice(pkg1 : PricingPackage, pkg2 : PricingPackage) : Order.Order {
      Float.compare(pkg1.price, pkg2.price);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  var therapistProfile : TherapistProfile = {
    name = "Jane Doe";
    tagline = "Heal by the Sea";
    bio = "Certified therapist offering beach therapy sessions in Ostende, Belgium. Find peace, clarity, and well-being through nature-based therapy.";
    photo = Blob.fromArray([0]);
  };

  let cvEntries = Map.empty<Text, CVEntry>();
  let sessionContentItems = Map.empty<Text, SessionContentItem>();
  let pricingPackages = Map.empty<Text, PricingPackage>();
  let contactFormSubmissions = Map.empty<Text, ContactFormSubmission>();

  include MixinStorage();

  // User profile management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public endpoints - no authorization needed
  public query ({ caller }) func getTherapistProfile() : async TherapistProfile {
    therapistProfile;
  };

  public query ({ caller }) func getAllCVEntries() : async [CVEntry] {
    cvEntries.values().toArray().sort(CVEntry.compareByYearRange);
  };

  public query ({ caller }) func getAllSessionContentItems() : async [SessionContentItem] {
    sessionContentItems.values().toArray().sort(SessionContentItem.compareByTitle);
  };

  public query ({ caller }) func getAllPricingPackages() : async [PricingPackage] {
    pricingPackages.values().toArray().sort(PricingPackage.compareByPrice);
  };

  // Visitor action - no authorization needed
  public shared ({ caller }) func submitContactForm(name : Text, email : Text, phone : ?Text, message : Text) : async () {
    let id = "form" # Int.abs(Time.now()).toText();
    let submission : ContactFormSubmission = {
      id;
      name;
      email;
      phone;
      message;
      timestamp = Time.now();
    };
    contactFormSubmissions.add(id, submission);
  };

  // Admin-only endpoints
  public shared ({ caller }) func updateTherapistProfile(profile : TherapistProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    therapistProfile := profile;
  };

  public shared ({ caller }) func updateProfilePhoto(blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    therapistProfile := { therapistProfile with photo = blob };
  };

  public shared ({ caller }) func addOrUpdateCVEntry(entry : CVEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    cvEntries.add(entry.id, entry);
  };

  public shared ({ caller }) func deleteCVEntry(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (cvEntries.containsKey(id)) {
      cvEntries.remove(id);
    } else {
      Runtime.trap("CV entry not found");
    };
  };

  public shared ({ caller }) func addOrUpdateSessionContentItem(item : SessionContentItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    sessionContentItems.add(item.id, item);
  };

  public shared ({ caller }) func deleteSessionContentItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (sessionContentItems.containsKey(id)) {
      sessionContentItems.remove(id);
    } else {
      Runtime.trap("Session content item not found");
    };
  };

  public shared ({ caller }) func addOrUpdatePricingPackage(pkg : PricingPackage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    pricingPackages.add(pkg.id, pkg);
  };

  public shared ({ caller }) func deletePricingPackage(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (pricingPackages.containsKey(id)) {
      pricingPackages.remove(id);
    } else {
      Runtime.trap("Pricing package not found");
    };
  };

  public query ({ caller }) func getAllContactFormSubmissions() : async [ContactFormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    contactFormSubmissions.values().toArray().sort(
      func(a, b) {
        Int.compare(b.timestamp, a.timestamp);
      }
    );
  };

  public shared ({ caller }) func seedSampleData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    therapistProfile := {
      name = "Jane Doe";
      tagline = "Heal by the Sea";
      bio = "Certified therapist offering beach therapy sessions in Ostende, Belgium. Find peace, clarity, and well-being through nature-based therapy.";
      photo = Blob.fromArray([0]);
    };

    cvEntries.clear();
    cvEntries.add(
      "edu1",
      {
        id = "edu1";
        title = "Master's in Psychology";
        organization = "University of Brussels";
        yearRange = "2010-2014";
        description = "Focus on clinical psychology and therapy methods.";
        type_ = #education;
      },
    );
    cvEntries.add(
      "cert1",
      {
        id = "cert1";
        title = "Certified Beach Therapy Practitioner";
        organization = "Belgian Therapy Association";
        yearRange = "2016";
        description = "Specialized training in nature-based therapy techniques.";
        type_ = #certification;
      },
    );

    sessionContentItems.clear();
    sessionContentItems.add(
      "mindfulness",
      {
        id = "mindfulness";
        title = "Mindfulness Meditation";
        description = "Guided mindfulness exercises by the sea.";
        iconName = "mindfulness";
      },
    );
    sessionContentItems.add(
      "talk",
      {
        id = "talk";
        title = "Talk Therapy";
        description = "Personalized talk sessions in a natural setting.";
        iconName = "talk";
      },
    );

    pricingPackages.clear();
    pricingPackages.add(
      "individual",
      {
        id = "individual";
        name = "Individual Session";
        duration = "60 minutes";
        price = 80.0;
        description = "One-on-one beach therapy session tailored to your needs.";
        bulletPoints = ["Personalized approach", "Stress relief techniques", "Mindfulness exercises"];
        highlighted = true;
      },
    );
    pricingPackages.add(
      "group",
      {
        id = "group";
        name = "Group Session";
        duration = "90 minutes";
        price = 120.0;
        description = "Group therapy session for up to 4 participants.";
        bulletPoints = ["Team building", "Shared experiences", "Collaborative healing"];
        highlighted = false;
      },
    );
  };
};
