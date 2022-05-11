#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BerlinglishStack } from "../lib/berlinglish-stack";

const app = new cdk.App();

new BerlinglishStack(app, "BerlinglishStack");
