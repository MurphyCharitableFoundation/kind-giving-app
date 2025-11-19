workspace "Kind Giving Application" "Web-based Fundraising Application" {

    !identifiers hierarchical
    
    model {
	##### USERS
	unregisteredUser = person "Guest/Unregistered User" "User not registered on the system."
	registeredUser = person "Registered User" "User registered on the system."
	

	group "MCF" {
	    beneficiary = person "Beneficiary" "MCF supported individual/group receiving benefits from donations."
	    staffUser = person "Staff User" "MCF staff performing management operations."
	    adminUser = person "Admin User" "MCF staff performing admin and management operations."
	    kindGivingSystem = softwareSystem "Kind Giving System" "Enables funding for MCF projects through community driven campaigns." {
		webAppFrontend = container "Web Application UI" "" {
		    technology "React"
		}
		webAppBackend = container "Web Application Services" "" {
		    technology "Django"
		}
		database = container "Application Database" "" {
		    technology "PostgreQL"
		    tags "Database"
		}
		
	    }

	    notificationSystem = softwareSystem "Notification System" {
		sms = container "SMS Dispatch" "Schedules and executes SMS notifications/messaging." {
		    technology "Twilio API"
		    tags "Notification"		
		}
		
		email = container "E-mail Dispatch" "Schedules and executes E-mail notifications." {
		    technology "AWS SES"
		    tags "Notification"
		}
	    }
	}

	group "Payment Platforms" {
	    stripeSystem = softwareSystem "Stripe" "Enables web money transfers without data risk." "External"
	    paypalSystem = softwareSystem "PayPal" "Enables web money transfers without data risk." "External"
	    mobileMoneyService = softwareSystem "Mobile Money Service" "Enables mobile money transfers on 3G networks." "External"
	    
	}
	

	# rel. people/systems -> systems
	# - userability
	unregisteredUser -> kindGivingSystem.webAppFrontend "share campaigns/projects, donate" "HTTPS"
	registeredUser -> kindGivingSystem.webAppFrontend "manage profile, make campaigns, share campaigns/projects, donate" "HTTPS"
	staffUser -> kindGivingSystem.webAppFrontend "manage projects, review campaigns/comments, assign beneficiaries" "HTTPS"
	adminUser -> kindGivingSystem.webAppFrontend "manage projects/campaigns/comments/donations" "HTTPS"			
	# - notifications
	notificationSystem -> registeredUser "notifies about contribution progress and project activity" "SMS/Email"
	notificationSystem -> unregisteredUser "notifies about contribution progress and project activity" "SMS/Email"
	kindGivingSystem -> notificationSystem "sends notifications through" "JSON/HTTPS"

	# - money
	## --
	mobileMoneyService -> beneficiary "send donation to" "SMS/3G"
	## -- automation
	kindGivingSystem.webAppBackend -> stripeSystem "users donate through" "JSON/HTTPS"
	kindGivingSystem.webAppBackend -> paypalSystem "users donate through" "JSON/HTTPS"
	kindGivingSystem.webAppBackend -> mobileMoneyService "beneficiaries receive donations through" "JSON/HTTPS"

	# rel. to/from containers
	kindGivingSystem.webAppFrontend -> kindGivingSystem.webAppBackend "requests data/services through API" "JSON/HTTPS"
	kindGivingSystem.webAppBackend -> kindGivingSystem.database "fetches/persists data from/to" "SQL/TCP"
    }

    views {
	systemLandscape "SystemLandscape" {
	    include *
	    # description "The system landscape diagram."
	}
	
	systemContext kindGivingSystem "kindGivingSystemContext" {
	    include *
	    autolayout
	    description "The system context diagram for the Kind Giving System."
	}

	container kindGivingSystem "kindGivingSystemContainers" {
	    include *
	    autolayout
	    description "The container diagram for the Kind Giving System."
	}

	styles {
            element "Web Browser" {
                shape WebBrowser
            }	    
	    
	    element "Database" {
		shape cylinder
	    }

	    element "Person" {
		shape person
	    }

	    element "External" {
		color #FFFFFF
		background #999999
	    }

	    element "Boundary" {
		strokeWidth 5
	    }

	    relationship "Relationship" {
		thickness 4
	    }
	    
	    element "Element" {
		stroke #0773af
		strokeWidth 7
		shape roundedbox
	    }

	}
    }
}
